<?php
/**
 * OceanWP Child Theme Functions
 */

function oceanwp_child_enqueue_styles() {
	// 加载父主题样式
	$parent_style = 'oceanwp-style';

	wp_enqueue_style( $parent_style, get_template_directory_uri() . '/style.css' );

	// 加载子主题样式 (确保子主题样式在父主题之后加载，这样你的修改才会生效)
	wp_enqueue_style( 'oceanwp-child-style',
		get_stylesheet_directory_uri() . '/style.css',
		array( $parent_style ),
		wp_get_theme()->get('Version')
	);
}
add_action( 'wp_enqueue_scripts', 'oceanwp_child_enqueue_styles' );