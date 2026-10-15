<?php
defined('ABSPATH') || exit;

function scipt_classification_source() {
    $path = get_stylesheet_directory() . '/assets/classement-cours.json';
    return is_readable($path) ? json_decode(file_get_contents($path), true) : array();
}
function scipt_save_classification() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_POST['scipt_classification_action'])) return;
    if (!current_user_can('manage_options')) wp_die('Accès réservé à l’administration.', '', array('response' => 403));
    $id = isset($_POST['scipt_course_id']) ? absint($_POST['scipt_course_id']) : 0;
    check_admin_referer('scipt_classification_' . $id, 'scipt_classification_nonce');
    $data = scipt_classification_source();
    $valid_courses = array_column(isset($data['courses']) ? $data['courses'] : array(), 'course_id');
    $catalogue_ids = array_map('strval', array_column(isset($data['filieres']) ? $data['filieres'] : array(), 'id'));
    $choice = isset($_POST['scipt_filiere_choice']) ? sanitize_key(wp_unslash($_POST['scipt_filiere_choice'])) : '';
    $buckets = array('transversal_sante', 'transversal_general', 'a_confirmer');
    if (!in_array($id, $valid_courses, true) || get_post_type($id) !== 'sfwd-courses' || (!in_array($choice, $catalogue_ids, true) && !in_array($choice, $buckets, true))) wp_die('Classement non valide.', '', array('response' => 400));
    $overrides = get_option('scipt_classification_overrides', array());
    if (!is_array($overrides)) $overrides = array();
    $overrides[$id] = array('catalogue_id' => in_array($choice, $catalogue_ids, true) ? $choice : null, 'status' => in_array($choice, $catalogue_ids, true) ? 'rattachement' : $choice, 'confirmed' => true, 'reason' => 'Classement modifié par un administrateur le ' . wp_date('d/m/Y H:i') . '.');
    update_option('scipt_classification_overrides', $overrides, false);
    $back = wp_get_referer();
    wp_safe_redirect(add_query_arg('scipt_saved', '1', $back ? $back : admin_url('admin.php?page=scipt-performances')));
    exit;
}
add_action('admin_post_scipt_save_classification', 'scipt_save_classification');
add_action('template_redirect', 'scipt_save_classification');

function scipt_render_course_classification($posts) {
    if (!current_user_can('manage_options')) return;
    $data = scipt_classification_source();
    $overrides = get_option('scipt_classification_overrides', array());
    if (!is_array($overrides)) $overrides = array();
    if (empty($data['courses']) || empty($data['filieres'])) return;
    $ids = array_fill_keys(wp_list_pluck($posts, 'ID'), true);
    $catalogue = array();
    foreach ($data['filieres'] as $f) $catalogue[$f['id']] = $f;
    $groups = array(); $counts = array('rattachement' => 0, 'transversal_sante' => 0, 'transversal_general' => 0, 'a_confirmer' => 0);
    $records = array();
    foreach ($data['courses'] as $course) {
        if (!isset($ids[$course['course_id']])) continue;
        if (isset($overrides[$course['course_id']]) && is_array($overrides[$course['course_id']])) $course = array_merge($course, $overrides[$course['course_id']]);
        $records[] = $course; $counts[$course['status']]++;
        if ($course['catalogue_id'] && isset($catalogue[$course['catalogue_id']])) {
            $f = $catalogue[$course['catalogue_id']];
            if (!isset($groups[$f['id']])) $groups[$f['id']] = array('title' => $f['title'], 'school' => $f['school'], 'count' => 0);
            $groups[$f['id']]['count']++;
        }
    }
    echo '<section class="scipt-stat-panel"><h2>Classement des cours — catalogue du nouveau site</h2><p>Les 19 rapprochements initiaux ont été confirmés par la direction. Chaque classement peut être modifié ci-dessous. Ces modifications ne changent ni les inscriptions ni les droits d’accès aux cours.</p><div class="scipt-kpis">';
    $labels = array('rattachement' => 'Classements par filière', 'transversal_sante' => 'Matières communes de santé', 'transversal_general' => 'Matières générales communes', 'a_confirmer' => 'Affectations à préciser');
    foreach ($labels as $key => $label) echo '<article><span>' . esc_html($label) . '</span><strong>' . (int) $counts[$key] . '</strong></article>';
    echo '</div><div class="scipt-table-scroll"><table class="widefat striped"><thead><tr><th>Filière du catalogue</th><th>École</th><th>Contenus classés</th></tr></thead><tbody>';
    foreach ($groups as $group) echo '<tr><th scope="row">' . esc_html($group['title']) . '</th><td>' . esc_html($group['school']) . '</td><td>' . (int) $group['count'] . '</td></tr>';
    if (!$groups) echo '<tr><td colspan="3">Aucun rapprochement sur la période sélectionnée.</td></tr>';
    echo '</tbody></table></div><details><summary>Examiner et modifier les classements</summary><div class="scipt-table-scroll"><table class="widefat striped"><thead><tr><th>Contenu</th><th>Classement</th><th>Motif</th><th>Modifier</th></tr></thead><tbody>';
    foreach ($records as $course) {
        $label = $course['catalogue_id'] && isset($catalogue[$course['catalogue_id']]) ? $catalogue[$course['catalogue_id']]['title'] : $labels[$course['status']];
        echo '<tr><th scope="row">' . esc_html(wp_specialchars_decode($course['title'], ENT_QUOTES)) . '</th><td>' . esc_html($label) . '</td><td>' . esc_html($course['reason']) . '</td><td><form method="post"><input type="hidden" name="action" value="scipt_save_classification"><input type="hidden" name="scipt_classification_action" value="save"><input type="hidden" name="scipt_course_id" value="' . (int) $course['course_id'] . '">';
        wp_nonce_field('scipt_classification_' . $course['course_id'], 'scipt_classification_nonce');
        echo '<label class="screen-reader-text" for="scipt-course-' . (int) $course['course_id'] . '">Classement du contenu</label><select id="scipt-course-' . (int) $course['course_id'] . '" name="scipt_filiere_choice">';
        $selected = $course['catalogue_id'] ? $course['catalogue_id'] : $course['status'];
        foreach ($labels as $key => $bucket) if ($key !== 'rattachement') echo '<option value="' . esc_attr($key) . '" ' . selected((string) $selected, (string) $key, false) . '>' . esc_html($bucket) . '</option>';
        foreach ($catalogue as $key => $f) echo '<option value="' . esc_attr($key) . '" ' . selected((string) $selected, (string) $key, false) . '>' . esc_html($f['title'] . ' — ' . $f['type']) . '</option>';
        echo '</select><button class="button button-primary" type="submit">Enregistrer</button></form></td></tr>';
    }
    echo '</tbody></table></div></details></section>';
}
