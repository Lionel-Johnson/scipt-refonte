<?php
/** Indicateurs administratifs de la refonte, calculés à partir des contenus existants. */
defined('ABSPATH') || exit;
require_once __DIR__ . '/scipt-classement.php';

add_action('init', function () {
    if (!post_type_exists('sfwd-courses')) return;
    $type = get_post_type_object('sfwd-courses');
    register_taxonomy('scipt_filiere', 'sfwd-courses', array(
        'labels' => array('name' => 'Filières SCIPT', 'singular_name' => 'Filière SCIPT', 'menu_name' => 'Filières SCIPT'),
        'hierarchical' => true, 'public' => false, 'show_ui' => true, 'show_admin_column' => true,
        'show_in_rest' => true, 'rewrite' => false,
        'capabilities' => array('manage_terms' => 'manage_options', 'edit_terms' => 'manage_options', 'delete_terms' => 'manage_options', 'assign_terms' => $type->cap->edit_posts),
    ));
}, 30);

add_action('admin_menu', function () {
    add_menu_page('Performances SCIPT', 'Performances SCIPT', 'manage_options', 'scipt-performances', 'scipt_render_performance_dashboard', 'dashicons-chart-bar', 3);
});
add_action('admin_enqueue_scripts', function () {
    wp_enqueue_style('scipt-admin', get_stylesheet_directory_uri() . '/assets/scipt-admin.css', array(), '20261015-1');
});
add_action('wp_dashboard_setup', function () {
    if (current_user_can('manage_options')) wp_add_dashboard_widget('scipt_activity', 'SCIPT — activité pédagogique', function () {
        $counts = wp_count_posts('sfwd-courses');
        echo '<p><strong>' . (int) $counts->publish . '</strong> contenus LearnDash publiés.</p><p><a class="button button-primary" href="' . esc_url(admin_url('admin.php?page=scipt-performances')) . '">Ouvrir les indicateurs</a></p>';
    });
});

function scipt_performance_data($period = 'all') {
    $query = array('post_type' => 'sfwd-courses', 'post_status' => array('publish', 'draft', 'pending', 'future', 'private'), 'posts_per_page' => -1, 'orderby' => 'date', 'order' => 'DESC', 'no_found_rows' => true, 'suppress_filters' => false);
    $days = array('30' => 30, '90' => 90, '365' => 365);
    if (isset($days[$period])) $query['date_query'] = array(array('after' => current_datetime()->modify('-' . $days[$period] . ' days')->format('Y-m-d H:i:s'), 'inclusive' => true));
    $posts = get_posts($query);
    $terms = get_terms(array('taxonomy' => 'scipt_filiere', 'hide_empty' => false));
    if (is_wp_error($terms)) $terms = array();
    $rows = array();
    foreach ($terms as $term) $rows[$term->term_id] = array('name' => $term->name, 'publish' => 0, 'draft' => 0, 'pending' => 0, 'other' => 0);
    $counts = array('publish' => 0, 'draft' => 0, 'pending' => 0, 'other' => 0);
    $unclassified = $counts; $authors = array(); $published_ids = array();
    $ids = wp_list_pluck($posts, 'ID'); $assignments = array();
    if ($ids) {
        $links = wp_get_object_terms($ids, 'scipt_filiere', array('fields' => 'all_with_object_id'));
        if (!is_wp_error($links)) foreach ($links as $link) $assignments[$link->object_id][] = $link->term_id;
    }
    foreach ($posts as $post) {
        $status = isset($counts[$post->post_status]) ? $post->post_status : 'other';
        $counts[$status]++;
        if ($status === 'publish') {
            $published_ids[] = $post->ID;
            $authors[$post->post_author] = isset($authors[$post->post_author]) ? $authors[$post->post_author] + 1 : 1;
        }
        if (empty($assignments[$post->ID])) $unclassified[$status]++;
        else foreach ($assignments[$post->ID] as $term_id) if (isset($rows[$term_id])) $rows[$term_id][$status]++;
    }
    arsort($authors);
    return compact('posts', 'rows', 'counts', 'unclassified', 'authors', 'published_ids');
}

function scipt_render_performance_dashboard() {
    if (!current_user_can('manage_options')) { echo '<p>Ces indicateurs sont réservés à l’administration.</p>'; return; }
    $period = isset($_GET['scipt_period']) ? sanitize_key(wp_unslash($_GET['scipt_period'])) : 'all';
    if (!in_array($period, array('all', '30', '90', '365'), true)) $period = 'all';
    $data = scipt_performance_data($period);
    $labels = array('publish' => 'Publiés', 'draft' => 'Brouillons', 'pending' => 'En attente de validation', 'other' => 'Privés ou planifiés');
    echo '<div class="wrap scipt-performance"><header class="scipt-performance-hero"><span>SCIPT INTERNATIONAL</span><h1>Pilotage pédagogique</h1><p>Suivez la publication des contenus et leur répartition par filière.</p></header>';
    echo '<form method="get" class="scipt-performance-filter">';
    if (is_admin()) echo '<input type="hidden" name="page" value="scipt-performances">';
    else {
        echo '<input type="hidden" name="scipt_performances" value="1">';
        if (isset($_GET['wpvibe_preview'])) echo '<input type="hidden" name="wpvibe_preview" value="' . esc_attr(sanitize_text_field(wp_unslash($_GET['wpvibe_preview']))) . '">';
    }
    echo '<label for="scipt-period">Date de publication ou création</label><select id="scipt-period" name="scipt_period">';
    foreach (array('all' => 'Toutes les dates', '30' => '30 derniers jours', '90' => '90 derniers jours', '365' => '365 derniers jours') as $value => $label) echo '<option value="' . esc_attr($value) . '" ' . selected($period, (string) $value, false) . '>' . esc_html($label) . '</option>';
    echo '</select><button class="button button-primary">Actualiser</button></form><div class="scipt-kpis">';
    foreach ($labels as $status => $label) echo '<article><span>' . esc_html($label) . '</span><strong>' . (int) $data['counts'][$status] . '</strong></article>';
    echo '</div><section class="scipt-stat-panel"><h2>Contenus par filière</h2><p>Le compteur porte sur les entrées « cours » de LearnDash, y compris les examens qui y sont enregistrés. Un contenu partagé entre plusieurs filières est compté dans chacune ; le total global reste unique.</p>';
    if (array_sum($data['unclassified'])) echo '<p class="scipt-data-notice"><strong>' . (int) $data['unclassified']['publish'] . ' contenus publiés sans filière.</strong> Rattachez les contenus à une filière depuis leur fiche de cours. Aucun classement automatique par titre n’est effectué.</p>';
    echo '<div class="scipt-table-scroll"><table class="widefat striped"><thead><tr><th scope="col">Filière</th><th scope="col">Publiés</th><th scope="col">Brouillons</th><th scope="col">En attente</th><th scope="col">Privés / planifiés</th></tr></thead><tbody>';
    $rows = array_values($data['rows']); $rows[] = array_merge(array('name' => 'Sans filière attribuée'), $data['unclassified']);
    foreach ($rows as $row) {
        echo '<tr><th scope="row">' . esc_html($row['name']) . '</th>';
        foreach (array_keys($labels) as $status) echo '<td>' . (int) $row[$status] . '</td>';
        echo '</tr>';
    }
    echo '</tbody></table></div><p><a class="button" href="' . esc_url(admin_url('edit-tags.php?taxonomy=scipt_filiere&post_type=sfwd-courses')) . '">Gérer les filières</a> <a class="button" href="' . esc_url(admin_url('edit.php?post_type=sfwd-courses')) . '">Classer les cours</a></p></section>';
    scipt_render_course_classification($data['posts']);
    echo '<section class="scipt-stat-panel"><h2>Contributions aux publications</h2><p>Auteur enregistré dans WordPress ; ce compteur ne mesure pas la réussite des étudiants.</p><div class="scipt-table-scroll"><table class="widefat striped"><thead><tr><th scope="col">Auteur</th><th scope="col">Contenus publiés</th></tr></thead><tbody>';
    foreach ($data['authors'] as $id => $count) {
        $user = get_userdata($id);
        echo '<tr><th scope="row">' . esc_html($user ? $user->display_name : 'Auteur indisponible') . '</th><td>' . (int) $count . '</td></tr>';
    }
    if (!$data['authors']) echo '<tr><td colspan="2">Aucune publication sur cette période.</td></tr>';
    echo '</tbody></table></div></section><p class="scipt-stat-footnote">Calcul à la demande · ' . esc_html(wp_date('d/m/Y H:i')) . ' · Période fondée sur la date du contenu, pas sa dernière modification.</p></div>';
}
