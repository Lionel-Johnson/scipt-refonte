<?php
/** Mon Compte conserve son widget natif, dans la navigation de la refonte. */
defined('ABSPATH') || exit;
$shell = json_decode(file_get_contents(get_stylesheet_directory() . '/assets/account-shell.json'), true);
$show_performance = isset($_GET['scipt_performances']) && current_user_can('manage_options');
if ($show_performance) {
    wp_enqueue_style('scipt-performance-preview', get_stylesheet_directory_uri() . '/assets/scipt-admin.css', array(), '20261015-1');
    ob_start(); scipt_render_performance_dashboard(); $account = ob_get_clean();
} else {
    $account = do_shortcode('[scipt_connexion]');
    if (current_user_can('manage_options')) $account = '<p class="scipt-account-admin-link"><a class="scipt-login-button" href="' . esc_url(add_query_arg('scipt_performances', '1')) . '">Pilotage pédagogique →</a></p>' . $account;
}
?><!doctype html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class('approved-site scipt-account-page'); ?>>
<?php wp_body_open(); echo scipt_global_page_corrections(scipt_institution_transform($shell['header'])); ?>
<main id="contenu" class="scipt-site" tabindex="-1"><?php if (!$show_performance) : ?><h1 class="scipt-account-title">Mon espace SCIPT</h1><?php endif; ?><?php echo $account; ?></main>
<?php echo scipt_global_page_corrections(scipt_institution_transform($shell['footer'])); wp_footer(); ?>
</body></html>
