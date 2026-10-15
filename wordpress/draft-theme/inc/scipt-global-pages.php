<?php
defined('ABSPATH') || exit;
// Corrections communes à toutes les pages du thème en brouillon.
function scipt_global_page_corrections($html) {
    $files = array('client-approved.js', 'fiches-data.js', 'fiche-formation.js', 'programme-contenus.js', 'professionnel-18-mois-ui.js', 'revision-octobre.js', 'programmes-detail-modern.js');
    foreach ($files as $file) {
        $pattern = '~(?:https?://[^\s"<>]+/|assets/)' . preg_quote($file, '~') . '(?:\?[^\s"<>]*)?~';
        $html = preg_replace($pattern, esc_url(get_stylesheet_directory_uri() . '/assets/' . $file . '?v=20261015-global'), $html);
    }
    return str_replace(array('Exemples de spécialisations', 'en cours de chargement...', 'en cours de chargement…'), array('Domaines de spécialisation', 'Consultez les informations du parcours ci-dessous.', 'Consultez les informations du parcours ci-dessous.'), $html);
}
add_filter('elementor/widget/render_content', 'scipt_global_page_corrections', 99);
add_filter('the_content', 'scipt_global_page_corrections', 99);

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('scipt-about-dialogs', get_stylesheet_directory_uri() . '/assets/about-dialogs.css', array(), '20261015');
    wp_enqueue_script('scipt-about-dialogs', get_stylesheet_directory_uri() . '/assets/about-dialogs.js', array(), '20261015', true);
});
