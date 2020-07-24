<?php
/**
 * Created by PhpStorm.
 * User: oveprev
 * Date: 2020-07-01
 * Time: 21:47
 */

add_action( "wp_ajax_getEvents", "getEvents" );
add_action( "wp_ajax_nopriv_getEvents", "getEvents" );

function getEvents() {
    header('Content-Type: application/json');
    $events_categories = [
        'conferences',
        'lohika-meet-ups',
        'webinars',
        'webinar-episodes',
        'good-people-dinners'
    ];
    $all_events = [];
//    $categoryId = get_option(SMT_POST_CATEGORY_ID);
    foreach ($events_categories as $events_categoriy) {
        $event_category = get_category_by_slug($events_categoriy);
        $all_events[] = $event_category->term_id;
    }
    $events = get_posts(array(
        'numberposts' => -1,
        'post_status' => array('publish'),
        'post_type' => 'post',
        'category__in' => $all_events,
        'order' => 'ASC',
    ));
    $events_data = array();
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
    $result = array(
        'data' => $events_data,
    );
    echo json_encode($result);
    exit;
}
