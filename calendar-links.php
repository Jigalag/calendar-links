<?php

/*
Plugin Name: Calendar Links
Version: 1.0
Author: Veprev Oleksii
Description: Generate calendar links or .ics file for events.
*/

if ( !defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

define('CL_URL', plugins_url( '/', __FILE__ ));
define('CL_PATH', plugin_dir_path( __FILE__ ));


define('CALENDAR_LINKS_EVENTS_CATEGORIES', 'calendar_links_events_categories');

require_once CL_PATH.'admin/settings.php';


require(CL_PATH.'admin/ajax-api.php');

