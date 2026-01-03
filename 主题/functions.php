<?php
/**
 * 精品烟酒商城主题功能文件
 *
 * @package Tobacco_Wine_Shop
 * @since 1.0.0
 */

// 防止直接访问
if (!defined('ABSPATH')) {
    exit;
}

/**
 * 主题设置
 */
function tobacco_wine_shop_setup() {
    // 添加主题支持
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    
    // 注册导航菜单
    register_nav_menus(array(
        'primary' => '主导航菜单',
    ));
}
add_action('after_setup_theme', 'tobacco_wine_shop_setup');

/**
 * 加载样式和脚本
 */
function tobacco_wine_shop_scripts() {
    // 加载主题样式
    wp_enqueue_style('tobacco-wine-shop-style', get_stylesheet_uri(), array(), '1.0.0');
    
    // 加载主题脚本
    wp_enqueue_script('tobacco-wine-shop-data', get_template_directory_uri() . '/js/data.js', array(), '1.0.0', true);
    wp_enqueue_script('tobacco-wine-shop-app', get_template_directory_uri() . '/js/app.js', array('jquery'), '1.0.0', true);
    
    // 本地化脚本（如果需要传递PHP数据到JS）
    wp_localize_script('tobacco-wine-shop-app', 'tobaccoWineShop', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('tobacco_wine_shop_nonce'),
    ));
}
add_action('wp_enqueue_scripts', 'tobacco_wine_shop_scripts');

/**
 * 注册侧边栏
 */
function tobacco_wine_shop_widgets_init() {
    register_sidebar(array(
        'name'          => '侧边栏',
        'id'            => 'sidebar-1',
        'description'   => '添加小工具到这里',
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));
}
add_action('widgets_init', 'tobacco_wine_shop_widgets_init');

/**
 * 自定义Logo支持
 */
function tobacco_wine_shop_custom_logo_setup() {
    $defaults = array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
        'header-text' => array('site-title', 'site-description'),
    );
    add_theme_support('custom-logo', $defaults);
}
add_action('after_setup_theme', 'tobacco_wine_shop_custom_logo_setup');

/**
 * 獲取頁面連結的輔助函數
 * 如果頁面存在則返回實際連結，否則返回基於slug的預留連結
 *
 * @param string $title 頁面標題
 * @return string 頁面URL
 */
function get_page_url_by_title($title) {
    $page = get_page_by_title($title);
    if ($page) {
        return get_permalink($page->ID);
    }
    // 如果頁面不存在，返回基於slug的URL（預留連結）
    $slug = sanitize_title($title);
    return home_url('/' . $slug . '/');
}

