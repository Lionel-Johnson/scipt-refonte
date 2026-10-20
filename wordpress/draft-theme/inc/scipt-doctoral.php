<?php
/** Quatre grands domaines et seize fiches issus du document client du 20 octobre. */
defined('ABSPATH') || exit;

function scipt_doctoral_views() {
    static $views;
    if ($views === null) {
        $path = get_stylesheet_directory() . '/assets/domaines-doctoraux-fragments.json';
        $views = is_readable($path) ? json_decode(file_get_contents($path), true) : array();
    }
    return is_array($views) ? $views : array();
}
function scipt_doctoral_requested_view() {
    if (scipt_institution_requested_page_id() !== 7891 || !isset($_GET['id'])) return null;
    $id = sanitize_text_field(wp_unslash($_GET['id']));
    if (!in_array($id, array('7666', '7667', '7668', '7669'), true)) return null;
    $views = scipt_doctoral_views();
    $number = isset($_GET['domaine']) ? sanitize_text_field(wp_unslash($_GET['domaine'])) : '';
    return $views[$id . '-' . $number] ?? ($views[$id] ?? null);
}
function scipt_doctoral_transform($html) {
    if (!is_string($html)) return $html;
    if (scipt_institution_requested_page_id() === 7881) {
        $path = get_stylesheet_directory() . '/assets/edi-domaines-fragment.html';
        if (is_readable($path) && strpos($html, 'id="domaines-doctoraux"') === false) {
            $fragment = scipt_institution_transform(file_get_contents($path));
            $html = preg_replace_callback('~<section class="inst-section"><div class="container"><h2>Les domaines doctoraux</h2>.*?</section>~s', function () use ($fragment) { return $fragment; }, $html, 1);
        }
        $html = str_replace('Quatre domaines doctoraux</h3>', 'Quatre grands domaines, seize domaines doctoraux</h3>', $html);
    }
    $view = scipt_doctoral_requested_view();
    if (!$view) return $html;
    foreach ($view['panels'] as $id => $markup) {
        $markup = scipt_institution_transform($markup);
        if (preg_match('~<div\b[^>]*\bid="' . preg_quote($id, '~') . '"[^>]*>~', $html)) {
            $html = scipt_institution_menu($html, $id, $markup);
        } else {
            $pattern = '~(<section\b[^>]*\bid="' . preg_quote($id, '~') . '"[^>]*>).*?(</section>)~s';
            $html = preg_replace_callback($pattern, function ($m) use ($markup) { return $m[1] . $markup . $m[2]; }, $html, 1);
        }
    }
    $html = preg_replace_callback('~(<h1\b[^>]*\bid="program-title"[^>]*>).*?(</h1>)~s', function ($m) use ($view) { return $m[1] . esc_html($view['title']) . $m[2]; }, $html, 1);
    $html = preg_replace_callback('~(<span\b[^>]*\bid="program-type"[^>]*>).*?(</span>)~s', function ($m) use ($view) { return $m[1] . ($view['number'] ? 'DOMAINE DOCTORAL ' . absint($view['number']) : 'GRAND DOMAINE DOCTORAL') . $m[2]; }, $html, 1);
    $labels = array('objectifs'=>'Orientation scientifique', 'programme-detaille'=>'Disciplines et spécialités', 'stages'=>'Axes de recherche', 'conditions'=>'Accès et positionnement', 'debouches'=>'Déroulement', 'frais'=>'Durées et coûts');
    foreach ($labels as $id => $label) {
        $html = preg_replace_callback('~(<a\b[^>]*href="#' . $id . '"[^>]*>).*?(</a>)~s', function ($m) use ($label) { return $m[1] . esc_html($label) . $m[2]; }, $html);
    }
    return $html;
}
add_action('template_redirect', function () {
    if (!is_admin() && !is_feed()) ob_start('scipt_doctoral_transform');
}, 2);
add_filter('pre_get_document_title', function ($title) {
    $view = scipt_doctoral_requested_view();
    return $view ? $view['title'] . ' — École Doctorale Internationale SCIPT' : $title;
}, 10000);
add_filter('body_class', function ($classes) {
    if (scipt_doctoral_requested_view()) $classes[] = 'scipt-programme-modern';
    return $classes;
});
add_action('wp_enqueue_scripts', function () {
    $view = scipt_doctoral_requested_view();
    if (!$view && scipt_institution_requested_page_id() !== 7881) return;
    $root = get_stylesheet_directory_uri() . '/assets/';
    wp_enqueue_style('scipt-doctoral', $root . 'domaines-doctoraux.css', array(), '20261020-doctoral16');
    if (!$view) return;
    wp_enqueue_script('scipt-doctoral-data', $root . 'domaines-doctoraux-data.js', array(), '20261020-doctoral16', true);
    wp_enqueue_script('scipt-doctoral-ui', $root . 'domaines-doctoraux-ui.js', array('scipt-doctoral-data'), '20261020-doctoral16', true);
    $links = array();
    foreach (array('programme', 'ecole-scipt-international', 'contact', 'admissions', 'candidature') as $slug) {
        $anchor = scipt_institution_transform('<a href="' . $slug . '.html"></a>');
        if (preg_match('~href="([^"]+)"~', $anchor, $match)) $links[$slug] = html_entity_decode($match[1], ENT_QUOTES, 'UTF-8');
    }
    wp_add_inline_script('scipt-doctoral-ui', 'window.SCIPT_DOCTORAL_LINKS=' . wp_json_encode($links) . ';', 'before');
    $scripts = wp_scripts();
    $handle = 'scipt-programme-programmes-detail-modern';
    if (isset($scripts->registered[$handle])) $scripts->registered[$handle]->deps[] = 'scipt-doctoral-ui';
}, 30);
