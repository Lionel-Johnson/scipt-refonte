<?php
/** Identité officielle transmise par la direction le 20 octobre 2026. */
defined('ABSPATH') || exit;

function scipt_official_logo_urls() {
    static $logos;
    if ($logos !== null) return $logos;
    $path = get_stylesheet_directory() . '/assets/logos-officiels-urls.json';
    $logos = is_readable($path) ? json_decode(file_get_contents($path), true) : array();
    return is_array($logos) ? $logos : array();
}

function scipt_official_logos_transform($html) {
    $logos = scipt_official_logo_urls();
    if (!$logos || !is_string($html)) return $html;
    $files = array(
        'sante.jpg'=>'ESSA', 'droit.jpg'=>'ESGA', 'technique.jpg'=>'ESTI', 'blason-doctoral.png'=>'EDI',
        'logo-academy-client.png'=>'academy', 'logo-academy-officiel.jpg'=>'academy',
        'logo-university-client.jpeg'=>'university', 'logo-university-officiel.jpg'=>'university',
        'essa-scipt-20261020.webp'=>'ESSA', 'esga-scipt-20261020.webp'=>'ESGA',
        'esti-scipt-20261020.webp'=>'ESTI', 'eshc-scipt-20261020.webp'=>'ESHC',
        'edi-scipt-20261020.webp'=>'EDI', 'edi-scipt-bandeau-20261020.webp'=>'ediLockup',
        'scipt-academy-20261020.webp'=>'academy', 'scipt-university-20261020.webp'=>'university'
    );
    $html = preg_replace_callback('~<(?:img|video)\b[^>]*>~i', function ($tag) use ($logos, $files) {
        $eshc = preg_match('~\balt=["\x27][^"\x27]*(?:ESHC|Sciences Humaines)[^"\x27]*["\x27]~iu', $tag[0]);
        return preg_replace_callback('~\b(src|poster)=(["\x27])([^"\x27]+)\2~i', function ($attr) use ($logos, $files, $eshc) {
            $path = wp_parse_url(html_entity_decode($attr[3], ENT_QUOTES), PHP_URL_PATH);
            $key = $files[basename((string) $path)] ?? null;
            if ($eshc && $key === 'university') $key = 'ESHC';
            return $key && isset($logos[$key]) ? $attr[1] . '=' . $attr[2] . esc_url($logos[$key]) . $attr[2] : $attr[0];
        }, $tag[0]);
    }, $html);
    if (scipt_institution_requested_page_id() === 7881 && strpos($html, 'sc-doctoral-lockup') === false && isset($logos['ediLockup'])) {
        $banner = '<img class="sc-track-lockup sc-doctoral-lockup" src="' . esc_url($logos['ediLockup']) . '" alt="École Doctorale Internationale SCIPT — EDI-SCIPT" width="1942" height="809">';
        $html = preg_replace('~<span class="inst-kicker">SCIPT INTERNATIONAL UNIVERSITY</span>~', $banner, $html, 1);
    }
    return $html;
}

add_filter('elementor/widget/render_content', 'scipt_official_logos_transform', 110);
add_filter('the_content', 'scipt_official_logos_transform', 110);
add_action('template_redirect', function () {
    if (!is_admin() && !is_feed()) ob_start('scipt_official_logos_transform');
}, 0);
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_script('scipt-official-logos', get_stylesheet_directory_uri() . '/assets/logos-officiels.js', array(), '20261020-logos', false);
    wp_add_inline_script('scipt-official-logos', 'window.SCIPT_LOGOS=' . wp_json_encode(scipt_official_logo_urls()) . ';', 'before');
}, 5);
