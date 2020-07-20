<?php
/**
 * Created by PhpStorm.
 * User: oveprev
 * Date: 2020-07-01
 * Time: 21:50
 */

function calendar_links() {
    require_once 'templates/calendar-links-admin-page.php';
}

function calendar_links_menu() {
    add_menu_page("Calendar Links", "Calendar Links", "calendar_links_options", "calendar_links", "calendar_links", "");
}
add_action("admin_menu", "calendar_links_menu");


$admin = get_role( 'administrator' );
if ( ! empty( $admin ) ) {
    $admin->add_cap( 'calendar_links_options' );
}
$editor = get_role( 'editor' );
if ( ! empty( $editor ) ) {
    $editor->add_cap( 'calendar_links_options' );
}
