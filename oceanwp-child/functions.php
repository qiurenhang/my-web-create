<?php
/**
 * OceanWP Child Theme Functions
 *
 * 确保代码全是英文符号，不要用中文符号。
 */

function oceanwp_child_enqueue_styles() {
    // 父主题的句柄 (Handle)
    $parent_style = 'oceanwp-style';

    // 1. 加载父主题样式
    wp_enqueue_style( $parent_style, get_template_directory_uri() . '/style.css' );

    // 2. 加载子主题样式 (确保在父主题之后加载，这样你的 CSS 才能覆盖父主题)
    wp_enqueue_style( 'oceanwp-child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array( $parent_style ),
        wp_get_theme()->get('Version')
    );
}

// 挂载到 WordPress 的脚本加载钩子上
add_action( 'wp_enqueue_scripts', 'oceanwp_child_enqueue_styles' );
