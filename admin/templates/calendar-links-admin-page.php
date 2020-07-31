<?php
/**
 * Created by PhpStorm.
 * User: oveprev
 * Date: 2020-07-01
 * Time: 21:55
 */

?>
<script>
    window.ajaxURL = '<?php echo admin_url( 'admin-ajax.php' ); ?>';
</script>
<style>
    .react-datepicker-wrapper input {
        height: 40px !important;
        border: 1px solid #ccc !important;
        padding: 0 20px !important;
        font: 16px Arial;
        display: block;
        width: 100%;
        -webkit-border-radius: 0 !important;
        -moz-border-radius: 0 !important;
        border-radius: 0 !important;
    }
    .react-datepicker-wrapper input:focus {
        outline: none !important;
        -webkit-box-shadow: none !important;
        -moz-box-shadow: none !important;
        box-shadow: none !important;
        border-color: #6e6e6e !important;
    }
    .react-datepicker-wrapper {
        width: 350px;
        display: flex;
        justify-content: space-between;
    }
    .react-datepicker__input-container {
        display: flex;
    }
</style>

<div id="root"></div>

<script src="<?php echo CL_URL.'/assets/js/bundle.js'; ?>"></script>
