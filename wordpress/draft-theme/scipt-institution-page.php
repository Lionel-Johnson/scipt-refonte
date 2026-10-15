<?php
defined('ABSPATH') || exit;
$data = scipt_institution_registry();
$name = array_search(get_queried_object_id(), scipt_institution_page_map(), true);
$main = $data['pages'][$name] ?? '';
$shell = json_decode(file_get_contents(get_stylesheet_directory() . '/assets/account-shell.json'), true);
?><!doctype html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class('approved-site scipt-institution-page'); ?>>
<?php wp_body_open(); echo scipt_global_page_corrections(scipt_institution_transform(($shell['header'] ?? '') . $main . ($shell['footer'] ?? ''))); wp_footer(); ?>
</body></html>
