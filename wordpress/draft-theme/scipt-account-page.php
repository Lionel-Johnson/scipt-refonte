<?php
/** Mon Compte conserve son widget natif, dans la navigation de la refonte. */
defined('ABSPATH') || exit;
$shell = json_decode(file_get_contents(get_stylesheet_directory() . '/assets/account-shell.json'), true);
$account = do_shortcode('[scipt_connexion]');
?><!doctype html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class('scipt-account-page'); ?>>
<?php wp_body_open(); echo $shell['header']; ?>
<main id="contenu" class="scipt-site" tabindex="-1"><h1 class="scipt-account-title">Connexion à votre espace</h1><?php echo $account; ?></main>
<?php echo $shell['footer']; wp_footer(); ?>
</body></html>
