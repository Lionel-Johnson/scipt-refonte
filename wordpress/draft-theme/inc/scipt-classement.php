<?php
defined('ABSPATH') || exit;

function scipt_render_course_classification($posts) {
    if (!current_user_can('manage_options')) return;
    $path = get_stylesheet_directory() . '/assets/classement-cours.json';
    if (!is_readable($path)) return;
    $data = json_decode(file_get_contents($path), true);
    if (empty($data['courses']) || empty($data['filieres'])) return;
    $ids = array_fill_keys(wp_list_pluck($posts, 'ID'), true);
    $catalogue = array();
    foreach ($data['filieres'] as $f) $catalogue[$f['id']] = $f;
    $groups = array(); $counts = array('rattachement' => 0, 'transversal_sante' => 0, 'transversal_general' => 0, 'a_confirmer' => 0);
    $records = array();
    foreach ($data['courses'] as $course) {
        if (!isset($ids[$course['course_id']])) continue;
        $records[] = $course; $counts[$course['status']]++;
        if ($course['catalogue_id'] && isset($catalogue[$course['catalogue_id']])) {
            $f = $catalogue[$course['catalogue_id']];
            if (!isset($groups[$f['id']])) $groups[$f['id']] = array('title' => $f['title'], 'school' => $f['school'], 'count' => 0);
            $groups[$f['id']]['count']++;
        }
    }
    echo '<section class="scipt-stat-panel"><h2>Classement de travail — catalogue du nouveau site</h2><p>Les rapprochements ci-dessous sont proposés pour validation pédagogique. Ils ne modifient ni les inscriptions, ni les droits d’accès, ni les affectations administratives des cours.</p><div class="scipt-kpis">';
    $labels = array('rattachement' => 'Rapprochements par filière', 'transversal_sante' => 'Matières communes de santé', 'transversal_general' => 'Matières générales communes', 'a_confirmer' => 'Affectations à préciser');
    foreach ($labels as $key => $label) echo '<article><span>' . esc_html($label) . '</span><strong>' . (int) $counts[$key] . '</strong></article>';
    echo '</div><div class="scipt-table-scroll"><table class="widefat striped"><thead><tr><th>Filière du catalogue</th><th>École</th><th>Contenus rapprochés</th></tr></thead><tbody>';
    foreach ($groups as $group) echo '<tr><th scope="row">' . esc_html($group['title']) . '</th><td>' . esc_html($group['school']) . '</td><td>' . (int) $group['count'] . '</td></tr>';
    if (!$groups) echo '<tr><td colspan="3">Aucun rapprochement sur la période sélectionnée.</td></tr>';
    echo '</tbody></table></div><details><summary>Examiner les contenus et les cas à préciser</summary><div class="scipt-table-scroll"><table class="widefat striped"><thead><tr><th>Contenu</th><th>Classement</th><th>Motif</th></tr></thead><tbody>';
    foreach ($records as $course) {
        $label = $course['catalogue_id'] && isset($catalogue[$course['catalogue_id']]) ? $catalogue[$course['catalogue_id']]['title'] : $labels[$course['status']];
        echo '<tr><th scope="row">' . esc_html(wp_specialchars_decode($course['title'], ENT_QUOTES)) . '</th><td>' . esc_html($label) . '</td><td>' . esc_html($course['reason']) . '</td></tr>';
    }
    echo '</tbody></table></div></details></section>';
}
