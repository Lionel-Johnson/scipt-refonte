<?php
/** Cartes de navigation À propos : pictogrammes, ombres et halos de la charte. */
defined('ABSPATH') || exit;
function scipt_aurora_about_page() {
    return in_array(scipt_institution_requested_page_id(), array(8039, 7890), true);
}
add_action('template_redirect', function () {
    if (is_admin() || is_feed() || !scipt_aurora_about_page()) return;
    ob_start(function ($html) {
        $path = get_stylesheet_directory() . '/assets/about-cards-fragment.html';
        if (!is_readable($path)) return $html;
        $fragment = scipt_institution_transform(file_get_contents($path));
        return preg_replace_callback('~<nav\b[^>]*class="[^"]*\babout-subnav\b[^"]*"[^>]*>.*?</nav>~s', function () use ($fragment) { return $fragment; }, $html, 1);
    });
}, 3);
add_action('wp_enqueue_scripts', function () {
    if (!scipt_aurora_about_page()) return;
    $root = get_stylesheet_directory_uri() . '/assets/';
    $version = '20261020-aurora';
    wp_enqueue_style('scipt-about-cards', $root . 'about-cards.css', array('scipt-institution'), $version);
    wp_enqueue_script('scipt-about-cards-data', $root . 'about-cards-data.js', array(), $version, true);
    wp_enqueue_script('scipt-about-cards', $root . 'about-cards.js', array('scipt-about-cards-data', 'scipt-about-dialogs'), $version, true);
    $scripts = wp_scripts();
    if (isset($scripts->registered['scipt-about-dialogs'])) $scripts->registered['scipt-about-dialogs']->ver = $version;
}, 40);
