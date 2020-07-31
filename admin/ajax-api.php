<?php
/**
 * Created by PhpStorm.
 * User: oveprev
 * Date: 2020-07-01
 * Time: 21:47
 */

add_action( "wp_ajax_getEvents", "getEvents" );
add_action( "wp_ajax_nopriv_getEvents", "getEvents" );
add_action( "wp_ajax_getCategories", "getCategories" );
add_action( "wp_ajax_nopriv_getCategories", "getCategories" );
add_action( "wp_ajax_getAllCategories", "getAllCategories" );
add_action( "wp_ajax_nopriv_getAllCategories", "getAllCategories" );
add_action( "wp_ajax_saveCategories", "saveCategories" );
add_action( "wp_ajax_nopriv_saveCategories", "saveCategories" );
add_action( "wp_ajax_getEventDate", "getEventDate" );
add_action( "wp_ajax_nopriv_getEventDates", "getEventDate" );

function saveCategories() {
    if (!empty(trim( file_get_contents("php://input")))) {
        $post = trim(file_get_contents("php://input"));
        $_POST = ( array ) json_decode( $post );
        $categories = $_POST['categories'];
        $result = update_option(CALENDAR_LINKS_EVENTS_CATEGORIES, $categories);
        header('Content-Type: application/json');
        $result = array(
            'status' => $result,
        );
        echo json_encode($result);
        exit;
    }
}

function getCategories() {
    header('Content-Type: application/json');
    $categories = get_option(CALENDAR_LINKS_EVENTS_CATEGORIES);
    if (!$categories) {
        $categories = array();
    }
    $result = array(
        'data' => $categories,
    );
    echo json_encode($result);
    exit;
}

function getAllCategories() {
    header('Content-Type: application/json');
    $all_categories = get_categories();
    $categories = array();
    if (count($all_categories) > 0) {
        foreach ($all_categories as $item) {
            $categories[] = $item;
        }
    }
    $result = array(
        'data' => $categories,
    );
    echo json_encode($result);
    exit;
}

function getEventDate() {
    if (!empty(trim( file_get_contents("php://input")))) {
        $post = trim(file_get_contents("php://input"));
        $_POST = ( array ) json_decode( $post );
        $time_zone_field = $_POST['timeZone'];
        $start_date_field = $_POST['startDate'];
        $end_date_field = $_POST['endDate'];
        $start_time_field = $_POST['startTime'];
        $end_time_field = $_POST['endTime'];
        $time_zone = new DateTimeZone($time_zone_field);
        $date_time_start = new DateTime($start_date_field.$start_time_field, $time_zone);
        $date_time_end = new DateTime($end_date_field.$end_time_field, $time_zone);
        $dt_start_utc = $date_time_start->setTimezone(new DateTimeZone('UTC'));
        $dt_end_utc = $date_time_end->setTimezone(new DateTimeZone('UTC'));
        header('Content-Type: application/json');
        $eventInfo = array();
        $eventInfo['dateStart'] = date_format($dt_start_utc, 'Ymd');
        $eventInfo['dateEnd'] = date_format($dt_end_utc, 'Ymd');
        $eventInfo['timeStart'] = date_format($dt_start_utc, 'His');
        $eventInfo['timeEnd'] = date_format($dt_end_utc, 'His');
        $eventInfo['dateStartO'] = date_format($dt_start_utc, 'Y-m-d');
        $eventInfo['dateEndO'] = date_format($dt_end_utc, 'Y-m-d');
        $eventInfo['timeStartO'] = date_format($dt_start_utc, 'H:i:s');
        $eventInfo['timeEndO'] = date_format($dt_end_utc, 'H:i:s');
        echo json_encode($eventInfo);
        exit;
    }
}

function getEvents() {
    header('Content-Type: application/json');
    $events_categories = array();
    $categories = get_option(CALENDAR_LINKS_EVENTS_CATEGORIES);
    foreach ($categories as $category) {
        $events_categories[] = $category->term_id;
    }
    $events_data = array();
    if (count($events_categories) > 0) {
        $events = get_posts(array(
            'numberposts' => -1,
            'post_status' => array('publish'),
            'post_type' => 'post',
            'category__in' => $events_categories,
            'order' => 'ASC',
        ));
        foreach ($events as $event) {
            $eventId = $event->ID;
            $date_time = get_field('date_time', $eventId);
            $location = get_field('location', $eventId);
            $time_zone_field = $date_time['time_zone'] >= 0 ? '+'.$date_time['time_zone'] : $date_time['time_zone'];
            $time_zone = new DateTimeZone($time_zone_field);
            $date_time_start = $date_time['date'] ? new DateTime($date_time['date'].$date_time['time_start'], $time_zone) : '';
            $date_time_end = $date_time['date_end'] ? new DateTime($date_time['date_end'].$date_time['time_end'], $time_zone) : '';
            $dt_start_utc = $date_time['date'] ? $date_time_start->setTimezone(new DateTimeZone('UTC')) : '';
            $dt_end_utc = $date_time['date_end'] ? $date_time_end->setTimezone(new DateTimeZone('UTC')) : '';
            $calendar = get_field('calendar_description', $eventId);
            $description = $calendar ? $calendar : get_field('preview_text', $eventId);
            $eventInfo = array();
            $eventInfo['dateStart'] = $dt_start_utc ? date_format($dt_start_utc, 'Ymd'): '';
            $eventInfo['dateEnd'] = $dt_end_utc ? date_format($dt_end_utc, 'Ymd') : '';
            $eventInfo['timeStart'] = $dt_start_utc ? date_format($dt_start_utc, 'His') : '';
            $eventInfo['timeEnd'] = $dt_end_utc ? date_format($dt_end_utc, 'His') : '';
            $eventInfo['dateStartO'] = $dt_start_utc ? date_format($dt_start_utc, 'Y-m-d'): '';
            $eventInfo['dateEndO'] = $dt_end_utc ? date_format($dt_end_utc, 'Y-m-d') : '';
            $eventInfo['timeStartO'] = $dt_start_utc ? date_format($dt_start_utc, 'H:i:s') : '';
            $eventInfo['timeEndO'] = $dt_end_utc ? date_format($dt_end_utc, 'H:i:s') : '';
            $eventInfo['title'] = $event->post_title;
            $eventInfo['eventLocation'] = $location['address'].' '.$location['region__state__zip'] ;;
            $eventInfo['eventDescription'] = addcslashes($description, '"');
            $eventInfo['id'] = $eventId;
            $events_data[] = $eventInfo;
        }
    }
    $result = array(
        'data' => $events_data,
    );
    echo json_encode($result);
    exit;
}
