<?php
/** Retours du 20 octobre : blasons séparateurs et photographies de stages réels. */
defined('ABSPATH') || exit;

function scipt_stage_photo_urls() {
    static $urls;
    if ($urls !== null) return $urls;
    $path = get_stylesheet_directory() . '/assets/stages-froid-media.json';
    $data = is_readable($path) ? json_decode(file_get_contents($path), true) : array();
    $urls = array();
    foreach (($data['photos'] ?? array()) as $key => $photo) {
        if (!empty($photo['url'])) $urls[$key] = $photo['url'];
    }
    return $urls;
}

function scipt_stage_page_requested() {
    $page_id = scipt_institution_requested_page_id();
    if (in_array($page_id, array(7803, 7509, 7911, 7845, 7909), true)) return true;
    return $page_id === 7891 && isset($_GET['id']) && in_array((string) wp_unslash($_GET['id']), array('7680', '7809'), true);
}

function scipt_school_dividers_transform($html) {
    $logos = scipt_official_logo_urls();
    return preg_replace_callback('~<ul\b[^>]*class="scipt-editorial-schools"[^>]*>.*?</ul>~s', function ($list) use ($logos) {
        return preg_replace_callback('~<a\b([^>]*)>(.*?)</a>~s', function ($link) use ($logos) {
            if (strpos($link[2], 'scipt-school-divider-crest') !== false) return $link[0];
            $label = trim(html_entity_decode(wp_strip_all_tags($link[2]), ENT_QUOTES, 'UTF-8'));
            if (!preg_match('~\b(ESGA|ESTI|ESSA|ESHC|EDI)-SCIPT\b~', $label, $match) || empty($logos[$match[1]])) return $link[0];
            $code = $match[1];
            $label = trim(preg_replace('~[,\s]*' . $code . '-SCIPT.*$~u', '', $label));
            return '<a class="scipt-school-divider"' . $link[1] . '><img class="scipt-school-divider-crest" src="' . esc_url($logos[$code]) . '" alt="Blason ' . esc_attr($code) . '-SCIPT" width="1254" height="1254" loading="lazy" decoding="async"><span class="scipt-school-divider-copy"><strong>' . esc_html($code) . '-SCIPT</strong><span>' . esc_html($label) . '</span></span><span class="scipt-school-divider-arrow" aria-hidden="true">↗</span></a>';
        }, $list[0]);
    }, $html);
}

function scipt_stage_page_transform($html) {
    if (!is_string($html)) return $html;
    $html = scipt_school_dividers_transform($html);
    if (!scipt_stage_page_requested()) return $html;
    if (strpos($html, 'id="stages-froid-climatisation"') === false && strpos($html, '</main>') !== false) {
        $path = get_stylesheet_directory() . '/assets/stages-froid-fragment.html';
        if (is_readable($path)) {
            $fragment = scipt_institution_transform(file_get_contents($path));
            if (scipt_institution_requested_page_id() === 7845) {
                $fragment = preg_replace('~<section\b~', '<section data-album="stages-froid"', $fragment, 1);
                $pattern = '~<section\b[^>]*id="mediatech"[^>]*>~';
                if (preg_match($pattern, $html)) {
                    $html = preg_replace_callback($pattern, function ($m) use ($fragment) { return $fragment . $m[0]; }, $html, 1);
                } else {
                    $html = str_replace('</main>', $fragment . '</main>', $html);
                }
            } else {
                $html = str_replace('</main>', $fragment . '</main>', $html);
            }
        }
    }
    if (scipt_institution_requested_page_id() === 7845 && strpos($html, 'data-media-filter="stages-froid"') === false) {
        $html = preg_replace('~(<div\b[^>]*aria-label="Choisir un album"[^>]*>)~', '$1<button aria-pressed="false" data-media-filter="stages-froid">Stages : froid et climatisation</button>', $html, 1);
    }
    foreach (scipt_stage_photo_urls() as $key => $url) {
        $relative = 'assets/stages/froid-climatisation/' . $key . '-20261020.webp';
        $html = str_replace(array('https://lionel-johnson.github.io/scipt-refonte/' . $relative, $relative), esc_url($url), $html);
    }
    return $html;
}

add_filter('elementor/widget/render_content', 'scipt_stage_page_transform', 120);
add_filter('the_content', 'scipt_stage_page_transform', 120);
add_action('template_redirect', function () {
    if (!is_admin() && !is_feed()) ob_start('scipt_stage_page_transform');
}, 1);
add_action('wp_enqueue_scripts', function () {
    if (!scipt_stage_page_requested()) return;
    $root = get_stylesheet_directory_uri() . '/assets/';
    $public = 'https://lionel-johnson.github.io/scipt-refonte/assets/';
    $page_id = scipt_institution_requested_page_id();
    if ($page_id === 7845) {
        wp_enqueue_style('scipt-mediatech-albums', $public . 'mediatech-albums.css', array(), '20261020-stages');
        wp_enqueue_script('scipt-mediatech-content', $public . 'mediatech-content.js', array(), '20261020-stages', true);
        wp_enqueue_script('scipt-mediatech', $public . 'mediatech.js', array('scipt-mediatech-content'), '20261020-stages', true);
        wp_enqueue_script('scipt-mediatech-albums', $public . 'mediatech-albums.js', array('scipt-mediatech'), '20261020-stages', true);
    }
    if (in_array($page_id, array(7911, 7909), true)) {
        wp_enqueue_script('scipt-stage-contenus-data', $public . 'contenus-data.js', array(), '20261020-stages', true);
        wp_enqueue_script('scipt-stage-contenus', $public . 'contenus.js', array('scipt-stage-contenus-data'), '20261020-stages', true);
    }
    if ($page_id === 7911) {
        wp_enqueue_style('scipt-professionnel-18-mois', $public . 'professionnel-18-mois.css', array(), '20261020-stages');
    }
    wp_enqueue_style('scipt-stages-froid', $root . 'stages-froid.css', array(), '20261020-stages');
    wp_enqueue_script('scipt-stages-froid-data', $root . 'stages-froid-data.js', array('scipt-media-data'), '20261020-stages', true);
    wp_add_inline_script('scipt-stages-froid-data', 'window.SCIPT_STAGE_URLS=' . wp_json_encode(scipt_stage_photo_urls()) . ';', 'before');
    $dependencies = array('scipt-stages-froid-data');
    if (scipt_institution_requested_page_id() === 7891) $dependencies[] = 'scipt-programme-programmes-detail-modern';
    wp_enqueue_script('scipt-stages-froid', $root . 'stages-froid.js', $dependencies, '20261020-stages', true);
}, 20);
