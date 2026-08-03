<?php

namespace TSJIPPY\EMBEDPAGE;

use TSJIPPY;

if (! defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', __NAMESPACE__ . '\restApiInit');
/**
 * Initialize the REST API routes for the embed page
 */
function restApiInit()
{
    // query for posts
    register_rest_route(
        TSJIPPY\RESTAPIPREFIX . '/embedpage',
        '/find',
        array(
            'methods'               => 'POST,GET',
            'callback'              => __NAMESPACE__ . '\findPosts',
            'permission_callback'   => function($wpRestRequest) {
                return true; // Allow public access
            },
            'args'                    => array(
                'search'    => array(
                    'required'    => true
                ),
            )
        )
    );

    register_rest_route(
        TSJIPPY\RESTAPIPREFIX . '/embedpage',
        '/result',
        array(
            'methods'               => 'POST,GET',
            'callback'              => __NAMESPACE__ . '\showPost',
            'permission_callback'   => function($wpRestRequest) {
                $postId = $wpRestRequest->get_param('id');

                $post = get_post($postId);

                if (!$post) {
                    return false;
                }

                if(!in_array($post->post_status, ['publish'])) {
                    return false;
                }

                /**
                 * Filters whether to allow access to the embed page for a specific post.
                 *
                 * @param bool $allowAccess Whether to allow access to the embed page.
                 * @param \WP_Post $post The post object.
                 * @return bool Whether to allow access to the embed page.
                 */
                return apply_filters('tsjippy-embed-page-allow-access', true, $post); // Allow public access
            },
            'args'                    => array(
                'id'    => array(
                    'required'    => true
                ),
                'collapsible'    => array(
                    'required'    => true
                ),
            )
        )
    );
}

/**
 * Find posts based on a search query
 *
 * @param \WP_REST_Request $wpRequest    The request object or an array of parameters
 *
 * @return array    The list of posts matching the search query
 */
function findPosts($wpRequest)
{
    $search = $wpRequest->get_param('search');

    if (strlen($search) < 3) {
        return [];
    }

    $args = array(
        'post_status'       => 'publish',
        'post_type'         => 'any',
        's'                 => $search,
        'posts_per_page'    => 1000
    );

    $wpQuery  = new \WP_Query($args);

    return $wpQuery->posts;
}

/**
 * Display the contents of a specific page
 *
 * @param \WP_REST_Request $wpRequest    The request object or an array of parameters
 *
 * @return string    The HTML content of the page
 */
function showPost($wpRequest)
{
    $id             = $wpRequest->get_param('id');
    $collapsible    = $wpRequest->get_param('collapsible');
    $linebreak      = $wpRequest->get_param('linebreak');

    return displayPageContents($id, $collapsible, $linebreak);
}
