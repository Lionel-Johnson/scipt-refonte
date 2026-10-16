<?php
/**
 * SCIPT INTERNATIONAL — espace pédagogique, étape 1.
 * Lecture des données LearnDash existantes. Aucun examen, utilisateur ou rôle n'est créé.
 */
defined('ABSPATH') || exit;

function scipt_peda_enseignant() {
    if (!is_user_logged_in()) return false;
    $u = wp_get_current_user();
    return (bool) array_intersect((array) $u->roles, array('wdm_instructor','tutor_instructor'));
}

function scipt_peda_compter($type, $statut, $auteur = 0) {
    if (!post_type_exists($type)) return 0;
    if (!$auteur && current_user_can('manage_options')) {
        $counts = wp_count_posts($type);
        return isset($counts->$statut) ? (int) $counts->$statut : 0;
    }
    if (!$auteur) return 0;
    $q = new WP_Query(array(
        'post_type' => $type, 'post_status' => $statut, 'author' => (int) $auteur,
        'posts_per_page' => 1, 'fields' => 'ids', 'no_found_rows' => false,
        'ignore_sticky_posts' => true
    ));
    return (int) $q->found_posts;
}

function scipt_peda_statut($status) {
    $labels = array(
        'publish' => 'Publié', 'pending' => 'En attente de validation',
        'draft' => 'Brouillon', 'future' => 'Planifié', 'private' => 'Privé'
    );
    return isset($labels[$status]) ? $labels[$status] : $status;
}

function scipt_peda_link($url, $label, $class = 'scipt-peda-link') {
    return '<a class="' . esc_attr($class) . '" href="' . esc_url($url) . '">' . esc_html($label) . '</a>';
}

function scipt_peda_content($atts = array()) {
    if (!is_user_logged_in()) {
        return '<div class="scipt-peda-login"><p>Connectez-vous pour retrouver vos cours et votre espace pédagogique.</p></div>';
    }
    $id = get_current_user_id();
    $is_admin = current_user_can('manage_options');
    $is_teacher = scipt_peda_enseignant();
    $is_leader = current_user_can('group_leader') && !$is_teacher && !$is_admin;
    ob_start();
    echo '<section class="scipt-peda" aria-labelledby="scipt-peda-heading">';
    echo '<span class="scipt-peda-eyebrow">SCIPT INTERNATIONAL · CAMPUS NUMÉRIQUE</span>';
    echo '<h2 id="scipt-peda-heading">' . esc_html($is_admin ? 'Pilotage pédagogique' : ($is_teacher ? 'Espace enseignant' : ($is_leader ? 'Suivi des groupes' : 'Mes cours'))) . '</h2>';
    if ($is_admin || $is_teacher) {
        $author = $is_admin ? 0 : $id;
        $course_published = scipt_peda_compter('sfwd-courses', 'publish', $author);
        $course_pending = scipt_peda_compter('sfwd-courses', 'pending', $author);
        $course_draft = scipt_peda_compter('sfwd-courses', 'draft', $author);
        $quiz_published = scipt_peda_compter('sfwd-quiz', 'publish', $author);
        echo '<div class="scipt-peda-stats" aria-label="Indicateurs">';
        foreach (array(
            array('Cours publiés', $course_published),
            array('Cours à valider', $course_pending),
            array('Brouillons', $course_draft),
            array('Quiz publiés', $quiz_published)
        ) as $metric) {
            echo '<div class="scipt-peda-metric"><strong>' . (int) $metric[1] . '</strong><span>' . esc_html($metric[0]) . '</span></div>';
        }
        echo '</div><p class="scipt-peda-note">Les chiffres proviennent des contenus LearnDash existants. Un quiz publié ne signifie pas qu’un examen a été programmé ou ouvert aux étudiants.</p>';
        echo '<nav class="scipt-peda-actions" aria-label="Actions pédagogiques">';
        if ($is_admin) {
            echo scipt_peda_link(admin_url('admin.php?page=scipt-performances'), 'Indicateurs par filière');
            echo scipt_peda_link(admin_url('edit.php?post_type=sfwd-courses&post_status=pending'), 'Valider les cours');
            echo scipt_peda_link(admin_url('edit.php?post_type=sfwd-quiz'), 'Gérer les quiz');
            echo scipt_peda_link(admin_url('users.php'), 'Comptes et rôles');
        } else {
            echo scipt_peda_link(home_url('/instructor-dashboard/'), 'Tableau de bord enseignant');
            if (current_user_can('edit_courses')) {
                echo scipt_peda_link(admin_url('edit.php?post_type=sfwd-courses'), 'Gérer mes cours');
                echo scipt_peda_link(admin_url('post-new.php?post_type=sfwd-courses'), 'Créer un cours');
            }
        }
        echo '</nav>';
        if ($is_teacher) {
            $recent = get_posts(array(
                'post_type' => 'sfwd-courses', 'post_status' => array('publish','draft','pending','future','private'),
                'author' => $id, 'posts_per_page' => 8, 'orderby' => 'modified', 'order' => 'DESC'
            ));
            echo '<div class="scipt-peda-panel"><h3>Mes derniers contenus</h3>';
            if (!$recent) echo '<p>Aucun cours attribué à ce compte pour le moment.</p>';
            foreach ($recent as $course) {
                if (!current_user_can('edit_post', $course->ID)) continue;
                echo '<div class="scipt-peda-entry"><div><strong>' . esc_html(get_the_title($course)) . '</strong><span>' . esc_html(scipt_peda_statut($course->post_status)) . '</span></div>';
                echo scipt_peda_link(get_edit_post_link($course->ID), 'Modifier');
                if ($course->post_status === 'draft') {
                    echo '<form class="scipt-peda-submit" method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
                    echo '<input type="hidden" name="action" value="scipt_demander_validation">';
                    echo '<input type="hidden" name="scipt_cours" value="' . (int) $course->ID . '">';
                    wp_nonce_field('scipt_validation_' . (int) $course->ID);
                    echo '<button type="submit">Soumettre pour validation</button></form>';
                }
                echo '</div>';
            }
            echo '</div>';
            $message = isset($_GET['scipt_validation']) ? sanitize_key(wp_unslash($_GET['scipt_validation'])) : '';
            if ($message === 'envoye') echo '<p class="scipt-peda-confirm" role="status">Le cours a été soumis à la validation de l’administration.</p>';
            elseif ($message === 'refuse') echo '<p class="scipt-peda-error" role="alert">Le cours n’a pas pu être soumis. Vérifiez vos droits et son statut.</p>';
        }
        if ($is_admin) {
            $pending = get_posts(array(
                'post_type' => array('sfwd-courses','sfwd-lessons','sfwd-quiz'),
                'post_status' => 'pending', 'posts_per_page' => 10,
                'orderby' => 'modified', 'order' => 'DESC'
            ));
            echo '<div class="scipt-peda-panel"><h3>Dernières soumissions à vérifier</h3>';
            if (!$pending) echo '<p>Aucune soumission de cours, leçon ou quiz en attente.</p>';
            else foreach ($pending as $post) {
                if (!current_user_can('edit_post', $post->ID)) continue;
                echo '<div class="scipt-peda-entry"><div><strong>' . esc_html(get_the_title($post)) . '</strong><span>' . esc_html(get_post_type_object($post->post_type)->labels->singular_name) . '</span></div>';
                echo scipt_peda_link(get_edit_post_link($post->ID), 'Examiner');
                echo '</div>';
            }
            echo '</div>';
        }
    } elseif ($is_leader) {
        echo '<p>Vous pouvez suivre les groupes d’étudiants et leur progression avec les outils LearnDash autorisés à votre compte.</p>';
        echo scipt_peda_link(admin_url('admin.php'), 'Ouvrir mon suivi pédagogique');
    } else {
        $enrolled = function_exists('learndash_user_get_enrolled_courses')
            ? (array) learndash_user_get_enrolled_courses($id) : array();
        $enrolled = array_slice(array_unique(array_map('absint', $enrolled)), 0, 100);
        $valid = array_filter($enrolled, function ($course_id) {
            return get_post_type($course_id) === 'sfwd-courses' && get_post_status($course_id) === 'publish';
        });
        echo '<div class="scipt-peda-stats"><div class="scipt-peda-metric"><strong>' . count($valid) . '</strong><span>Cours inscrits</span></div></div>';
        if (!$valid) echo '<p>Votre compte ne dispose pas encore de cours associés. Contactez le service scolarité si votre inscription a déjà été confirmée.</p>';
        else {
            echo '<div class="scipt-peda-panel"><h3>Reprendre mes cours</h3>';
            foreach (array_slice($valid, 0, 12) as $course_id) {
                echo '<div class="scipt-peda-entry"><strong>' . esc_html(get_the_title($course_id)) . '</strong>';
                echo scipt_peda_link(get_permalink($course_id), 'Accéder au cours') . '</div>';
            }
            echo '</div>';
        }
    }
    echo '</section>';
    return ob_get_clean();
}
add_shortcode('scipt_espace_pedagogique', 'scipt_peda_content');

/**
 * Soumission facultative des brouillons de cours par leur propre auteur.
 * Aucune modification des rôles, aucune publication automatique.
 */
add_action('admin_post_scipt_demander_validation', function () {
    if (!is_user_logged_in() || !scipt_peda_enseignant()) wp_die('Accès refusé.', '', array('response'=>403));
    $course_id = isset($_POST['scipt_cours']) ? absint($_POST['scipt_cours']) : 0;
    check_admin_referer('scipt_validation_' . $course_id);
    $course = get_post($course_id);
    $valid = $course && $course->post_type === 'sfwd-courses'
        && (int) $course->post_author === get_current_user_id()
        && $course->post_status === 'draft'
        && current_user_can('edit_post', $course_id);
    if ($valid) {
        $result = wp_update_post(array('ID'=>$course_id,'post_status'=>'pending'), true);
        $valid = !is_wp_error($result) && $result;
    }
    $url = wp_get_referer() ?: home_url('/mon-compte/');
    $url = remove_query_arg('scipt_validation', $url);
    wp_safe_redirect(add_query_arg('scipt_validation', $valid ? 'envoye' : 'refuse', $url));
    exit;
});

add_action('wp_enqueue_scripts', function () {
    if (is_page(array(2550,8045))) {
        wp_enqueue_style('scipt-pedagogie',
            get_stylesheet_directory_uri() . '/assets/scipt-pedagogie.css', array(), '20261016-a');
    }
});
