<?php
function oceanwp_child_enqueue_styles() {
    $parent_style = 'oceanwp-style';
    
    wp_enqueue_style( $parent_style, get_template_directory_uri() . '/style.css' );
    
    wp_enqueue_style( 'oceanwp-child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array( $parent_style ),
        wp_get_theme()->get('Version')
    );
}
add_action( 'wp_enqueue_scripts', 'oceanwp_child_enqueue_styles' );
