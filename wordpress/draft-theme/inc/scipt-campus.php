<?php
/**
 * Plugin Name: SCIPT Campus
 * Description: Propositions multimédias modérées et accès WordPress par rôle.
 * Version: 1.0.0
 */
defined('ABSPATH') || exit;

add_action('init', function () {
    register_post_type('scipt_proposition', array(
        'labels' => array('name' => 'Propositions Médiathèque', 'singular_name' => 'Proposition'),
        'public' => false, 'show_ui' => true, 'show_in_rest' => false,
        'supports' => array('title', 'editor'), 'map_meta_cap' => true,
        'capability_type' => 'post', 'capabilities' => array('create_posts' => 'manage_options'),
    ));
});



add_filter('login_redirect', function ($redirect, $requested, $user) {
    if (!($user instanceof WP_User)) return $redirect;
    if (user_can($user, 'manage_options')) return admin_url();
    if (in_array('wdm_instructor', (array) $user->roles, true)) return home_url('/instructor-dashboard/');
    if (in_array('wdm_instructor', (array) $user->roles, true)) return home_url('/instructor-dashboard/');
    if (user_can($user, 'edit_posts')) return admin_url('edit.php');
    return home_url('/mon-compte/');
}, 10, 3);

function scipt_private_directory() {
    $docroot = isset($_SERVER['DOCUMENT_ROOT']) ? realpath($_SERVER['DOCUMENT_ROOT']) : false;
    if (defined('SCIPT_PRIVATE_UPLOAD_DIR')) {
        $dir = SCIPT_PRIVATE_UPLOAD_DIR;
    } elseif ($docroot && dirname($docroot) !== $docroot) {
        $dir = dirname($docroot) . DIRECTORY_SEPARATOR . 'scipt-private-' . substr(hash('sha256', ABSPATH), 0, 12);
    } else { return false; }
    if (!wp_mkdir_p($dir)) return false;
    $real = realpath($dir);
    $webroot = realpath(ABSPATH);
    if (!$real || !$webroot || $real === $webroot || strpos($real, $webroot . DIRECTORY_SEPARATOR) === 0) return false;
    if ($docroot && ($real === $docroot || strpos($real, $docroot . DIRECTORY_SEPARATOR) === 0)) return false;
    return is_writable($real) ? $real : false;
}

add_shortcode('scipt_proposition', function () {
    ob_start();
    $state = isset($_GET['scipt_status']) ? sanitize_key(wp_unslash($_GET['scipt_status'])) : '';
    if ($state === 'sent') echo '<p role="status">Votre proposition a été reçue. Elle sera examinée avant toute publication.</p>';
    if ($state === 'error') echo '<p role="alert">L’envoi a échoué. Vérifiez les champs et le format du fichier, puis réessayez.</p>';
    ?>
    <form method="post" enctype="multipart/form-data" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
      <input type="hidden" name="action" value="scipt_submit">
      <?php wp_nonce_field('scipt_submit', 'scipt_nonce'); ?>
      <p><label>Nom *<br><input name="scipt_name" autocomplete="name" maxlength="120" required></label></p>
      <p><label>E-mail *<br><input name="scipt_email" type="email" autocomplete="email" maxlength="254" required></label></p>
      <p><label>Votre commentaire *<br><textarea name="scipt_message" rows="5" maxlength="1200" required></textarea></label></p>
      <p><label>Ajouter une image ou une vidéo<br><input name="scipt_file" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"></label><br><small>JPG, PNG, WebP, MP4 ou WebM. Maximum 20 Mo, selon la limite du serveur.</small></p>
      <p><label><input type="checkbox" name="scipt_consent" value="1" required> J’autorise l’équipe à me contacter et à examiner mon fichier avant une éventuelle diffusion.</label></p>
      <p style="display:none" aria-hidden="true"><label>Site personnel<input name="scipt_website" tabindex="-1" autocomplete="off"></label></p>
      <button type="submit">Envoyer ma proposition</button>
    </form>
    <?php return ob_get_clean();
});

function scipt_submit() {
    $url = admin_url('admin-post.php?action=scipt_form');
    $fail = function () use ($url) { wp_safe_redirect(add_query_arg('scipt_status', 'error', $url)); exit; };
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') $fail();
    $nonce = isset($_POST['scipt_nonce']) ? sanitize_text_field(wp_unslash($_POST['scipt_nonce'])) : '';
    if (!wp_verify_nonce($nonce, 'scipt_submit') || !empty($_POST['scipt_website'])) $fail();
    $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
    $rate_key = 'scipt_rate_' . hash_hmac('sha256', $ip, wp_salt());
    $count = (int) get_transient($rate_key);
    if ($count >= 5) $fail();
    set_transient($rate_key, $count + 1, HOUR_IN_SECONDS);
    $name = isset($_POST['scipt_name']) ? sanitize_text_field(wp_unslash($_POST['scipt_name'])) : '';
    $email = isset($_POST['scipt_email']) ? sanitize_email(wp_unslash($_POST['scipt_email'])) : '';
    $message = isset($_POST['scipt_message']) ? sanitize_textarea_field(wp_unslash($_POST['scipt_message'])) : '';
    if (!$name || strlen($name) > 480 || !is_email($email) || !$message || strlen($message) > 4800 || empty($_POST['scipt_consent'])) $fail();
    $stored = null;
    if (isset($_FILES['scipt_file']) && $_FILES['scipt_file']['error'] !== UPLOAD_ERR_NO_FILE) {
        $file = $_FILES['scipt_file'];
        $dir = scipt_private_directory();
        if (!$dir || $file['error'] !== UPLOAD_ERR_OK || $file['size'] > min(20 * MB_IN_BYTES, wp_max_upload_size()) || !is_uploaded_file($file['tmp_name'])) $fail();
        $allowed = array('jpg|jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'mp4' => 'video/mp4', 'webm' => 'video/webm');
        $check = wp_check_filetype_and_ext($file['tmp_name'], $file['name'], $allowed);
        if (!$check['ext'] || !$check['type']) $fail();
        if (!class_exists('finfo')) $fail();
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        if ($finfo->file($file['tmp_name']) !== $check['type']) $fail();
        if (strpos($check['type'], 'image/') === 0 && !getimagesize($file['tmp_name'])) $fail();
        $filename = wp_generate_uuid4() . '.' . $check['ext'];
        $destination = $dir . DIRECTORY_SEPARATOR . $filename;
        if (!move_uploaded_file($file['tmp_name'], $destination)) $fail();
        chmod($destination, 0600);
        $stored = array('filename' => $filename, 'type' => $check['type'], 'original' => sanitize_file_name($file['name']));
    }
    $id = wp_insert_post(array('post_type' => 'scipt_proposition', 'post_status' => 'pending',
        'post_title' => 'Proposition — ' . $name, 'post_content' => $message, 'post_author' => 0), true);
    if (is_wp_error($id) || !$id) {
        if ($stored) unlink($dir . DIRECTORY_SEPARATOR . $stored['filename']);
        $fail();
    }
    update_post_meta($id, '_scipt_email', $email);
    update_post_meta($id, '_scipt_consent', current_time('mysql'));
    if ($stored) update_post_meta($id, '_scipt_file', $stored);
    wp_safe_redirect(add_query_arg('scipt_status', 'sent', $url)); exit;
}
add_action('admin_post_scipt_submit', 'scipt_submit');
add_action('admin_post_nopriv_scipt_submit', 'scipt_submit');

function scipt_form() {
    nocache_headers();
    header('Content-Type: text/html; charset=UTF-8');
    echo '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Partager votre expérience — SCIPT</title><style>body{font:16px system-ui;color:#103d78;padding:16px;margin:0}input:not([type=checkbox]),textarea{box-sizing:border-box;width:100%;padding:10px;border:1px solid #aab4c5;border-radius:6px}button{background:#103d78;color:white;padding:12px 24px;border:0;border-radius:6px}small{display:block;margin-top:8px}label{line-height:1.6}</style></head><body>';
    echo do_shortcode('[scipt_proposition]');
    echo '</body></html>'; exit;
}
add_action('admin_post_scipt_form', 'scipt_form');
add_action('admin_post_nopriv_scipt_form', 'scipt_form');

add_action('add_meta_boxes', function () {
    add_meta_box('scipt-details', 'Contact et fichier proposé', function ($post) {
        if (!current_user_can('manage_options')) return;
        echo '<p>' . esc_html(get_post_meta($post->ID, '_scipt_email', true)) . '</p>';
        $file = get_post_meta($post->ID, '_scipt_file', true);
        if ($file) {
            $url = wp_nonce_url(admin_url('admin-post.php?action=scipt_download&id=' . $post->ID), 'scipt_download_' . $post->ID);
            echo '<a href="' . esc_url($url) . '">Télécharger le fichier pour validation</a>';
        }
    }, 'scipt_proposition');
});

// Seule l’administration consulte les propositions et leurs coordonnées.
add_filter('map_meta_cap', function ($caps, $cap, $user_id, $args) {
    if (in_array($cap, array('edit_post', 'read_post', 'delete_post'), true) && !empty($args[0]) && get_post_type($args[0]) === 'scipt_proposition') return array('manage_options');
    return $caps;
}, 10, 4);
add_action('pre_get_posts', function ($query) {
    if (is_admin() && $query->get('post_type') === 'scipt_proposition' && !current_user_can('manage_options')) $query->set('post__in', array(0));
});

add_action('admin_post_scipt_download', function () {
    $id = isset($_GET['id']) ? absint($_GET['id']) : 0;
    if (!current_user_can('manage_options') || get_post_type($id) !== 'scipt_proposition') wp_die('Accès refusé.', '', array('response' => 403));
    check_admin_referer('scipt_download_' . $id);
    $file = get_post_meta($id, '_scipt_file', true);
    $dir = scipt_private_directory();
    if (!$file || !$dir || basename($file['filename']) !== $file['filename']) wp_die('Fichier indisponible.');
    $path = $dir . DIRECTORY_SEPARATOR . $file['filename'];
    if (!is_file($path)) wp_die('Fichier indisponible.');
    nocache_headers();
    header('X-Content-Type-Options: nosniff');
    header('Content-Type: ' . $file['type']);
    header('Content-Disposition: attachment; filename="' . basename($file['filename']) . '"');
    header('Content-Length: ' . filesize($path));
    readfile($path); exit;
});

add_action('before_delete_post', function ($id) {
    if (get_post_type($id) !== 'scipt_proposition') return;
    $file = get_post_meta($id, '_scipt_file', true);
    $dir = scipt_private_directory();
    if ($file && $dir && basename($file['filename']) === $file['filename']) {
        $path = $dir . DIRECTORY_SEPARATOR . $file['filename'];
        if (is_file($path)) unlink($path);
    }
});

add_shortcode('scipt_connexion', function () {
    if (is_user_logged_in()) {
        $u = wp_get_current_user();
        $url = current_user_can('manage_options') ? admin_url() : (in_array('wdm_instructor', (array) $u->roles, true) ? home_url('/instructor-dashboard/') : home_url('/mon-compte/'));
        return '<p>Vous êtes connecté.</p><p><a href="' . esc_url($url) . '">Accéder à mon espace</a></p><p><a href="' . esc_url(wp_logout_url(home_url())) . '">Se déconnecter</a></p>';
    }
    return wp_login_form(array('echo' => false, 'label_username' => 'Identifiant ou e-mail', 'label_password' => 'Mot de passe', 'label_remember' => 'Se souvenir de moi', 'label_log_in' => 'Se connecter', 'redirect' => home_url('/mon-compte/'))) . '<p><a href="' . esc_url(wp_lostpassword_url()) . '">Mot de passe oublié ?</a></p>';
});
add_shortcode('scipt_blog', function () {
    $paged = isset($_GET['scipt_blog_page']) ? max(1, absint($_GET['scipt_blog_page'])) : 1;
    $q = new WP_Query(array('post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => 9, 'paged' => $paged));
    $html = '<div class="scipt-blog-grid">';
    while ($q->have_posts()) {
        $q->the_post();
        $html .= '<article><a href="' . esc_url(get_permalink()) . '">' . get_the_post_thumbnail(get_the_ID(), 'medium_large', array('loading' => 'lazy')) . '<h2>' . esc_html(get_the_title()) . '</h2></a><p>' . esc_html(wp_trim_words(wp_strip_all_tags(get_the_excerpt()), 35)) . '</p><a href="' . esc_url(get_permalink()) . '">Lire l’article →</a></article>';
    }
    if (!$q->post_count) $html .= '<p>Aucun article publié pour le moment.</p>';
    $html .= '</div>';
    for ($i = 1; $i <= $q->max_num_pages; $i++) $html .= '<a class="scipt-blog-page" href="' . esc_url(add_query_arg('scipt_blog_page', $i)) . '">' . $i . '</a> ';
    wp_reset_postdata();
    return $html;
});
add_action('wp_enqueue_scripts', function () {
    if (!is_page(array(7837,7890,7891,7881,7845,7841,7839,7509,7805,7803,7801,7511,7512,7902,7903,7904,7905,7906,7907,7908,7909,7910,7911,7945,8039,8040,8041,8042,8043,8044,8045,8046))) return;
    wp_enqueue_style('scipt-retours', get_stylesheet_directory_uri() . '/assets/scipt-retours.css', array(), '20261014');
    wp_enqueue_script('scipt-retours', get_stylesheet_directory_uri() . '/assets/scipt-retours.js', array(), '20261014', true);
});

require_once __DIR__ . '/scipt-portail.php';
require_once __DIR__ . '/scipt-espace-pedagogique.php';
