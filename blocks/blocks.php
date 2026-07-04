<?php

namespace TSJIPPY\EMBEDPAGE;

use TSJIPPY;

if (! defined('ABSPATH')) exit;

add_action('init', __NAMESPACE__ . '\blockInit');
function blockInit()
{
    register_block_type(
        __DIR__ . '/embedPage/build',
        array(
            'render_callback' => function( $attributes){
                $page    = json_decode($attributes['page']);
                if (isset($page->ID)) {
                    return displayPageContents($page->ID, $attributes['hide'], $attributes['newline']);
                }
            },
        )
    );
}
