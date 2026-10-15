<?php
defined('ABSPATH') || exit;
defined('SCIPT_DASHBOARD_PAGE') || define('SCIPT_DASHBOARD_PAGE', 8063);
add_action('wp_enqueue_scripts', function () {
    if (!is_page(array(7837, 7839, 7509, 7890, 8039, 8040, 8041, 8042, 8043, 8044, 8045, 8046, 8063, 8064, 8065, 8066, 7903, 7841))) return;
    wp_enqueue_style('scipt-corrections-octobre', get_stylesheet_directory_uri() . '/assets/corrections-octobre.css', array(), '20261014-2');
    wp_enqueue_script('scipt-corrections-octobre', get_stylesheet_directory_uri() . '/assets/corrections-octobre.js', array(), '20261014-2', true);
});

function scipt_portal_url($id, $args = array()) {
    $base = get_post_status($id) === 'draft' ? add_query_arg(array('page_id' => $id, 'preview' => 'true'), home_url('/')) : get_permalink($id);
    return add_query_arg($args, $base);
}

// Réutilisation de Mon Compte : mêmes formulaires, comptes et cours LearnDash.
function scipt_existing_account() {
    $url = get_permalink(2550);
    $content = '';
    if (class_exists('\Elementor\Plugin')) {
        $content = \Elementor\Plugin::instance()->frontend->get_builder_content(2550, true);
    }
    if (!$content) return '<div class="scipt-portal"><a class="scipt-login-button" href="' . esc_url($url) . '">Accéder à Mon Compte</a></div>';
    $intro = is_user_logged_in() ? '' : '<aside class="scipt-account-welcome"><span class="scipt-account-kicker">VOTRE ESPACE SCIPT</span><h2>Votre avenir commence ici.</h2><p>Connectez-vous pour retrouver vos cours et poursuivre votre parcours.</p><ul><li>Vos cours et disciplines</li><li>Votre espace personnel</li><li>Vos échanges pédagogiques</li></ul><p class="scipt-account-help">Un premier accès ? Choisissez « Inscrivez-vous maintenant » dans le formulaire.</p></aside>';
    return '<div id="scipt-account-shell" class="scipt-account-layout' . (is_user_logged_in() ? ' is-connected' : '') . '">' . $intro . '<section class="scipt-native-account" aria-label="Mon compte SCIPT">' . $content . '</section></div>';
}
remove_shortcode('scipt_connexion');
add_shortcode('scipt_connexion', 'scipt_existing_account');
add_shortcode('scipt_tableau_bord', 'scipt_existing_account');
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('scipt-auth-design', get_stylesheet_directory_uri() . '/assets/connexion.css', array(), '20261015-compte-v2');
    wp_enqueue_script('scipt-auth-design', get_stylesheet_directory_uri() . '/assets/connexion.js', array(), '20261015', true);
});

remove_shortcode('scipt_blog');
add_shortcode('scipt_blog', function () {
    $article = isset($_GET['article']) ? absint($_GET['article']) : 0;
    if ($article) {
        $post = get_post($article);
        if (!$post || $post->post_type !== 'post' || $post->post_status !== 'publish') return '<p>Article indisponible.</p>';
        $html = '<article class="scipt-portal scipt-blog-article"><a href="' . esc_url(scipt_portal_url(8044)) . '">← Tous les articles</a><h1>' . esc_html(get_the_title($post)) . '</h1><p class="scipt-blog-meta">' . esc_html(get_the_date('', $post)) . ' · ' . esc_html(get_the_author_meta('display_name', $post->post_author)) . '</p>';
        $html .= get_the_post_thumbnail($post, 'large') . apply_filters('the_content', $post->post_content);
        $comments = get_comments(array('post_id' => $article, 'status' => 'approve', 'order' => 'ASC'));
        $html .= '<section><h2>Commentaires</h2>';
        foreach ($comments as $comment) $html .= '<article><strong>' . esc_html($comment->comment_author) . '</strong><p>' . apply_filters('comment_text', esc_html($comment->comment_content), $comment) . '</p></article>';
        if (comments_open($article)) { ob_start(); comment_form(array('title_reply' => 'Votre commentaire'), $article); $form = ob_get_clean(); $html .= str_replace('<form ', '<form enctype="multipart/form-data" ', $form); }
        return $html . '</section></article>';
    }
    $paged = isset($_GET['scipt_blog_page']) ? max(1, absint($_GET['scipt_blog_page'])) : 1;
    $search = isset($_GET['recherche']) ? sanitize_text_field(wp_unslash($_GET['recherche'])) : '';
    $cat = isset($_GET['categorie']) ? absint($_GET['categorie']) : 0;
    $q = new WP_Query(array('post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => 9, 'paged' => $paged, 's' => $search, 'cat' => $cat));
    $html = '<div class="scipt-portal"><form method="get"><input type="hidden" name="page_id" value="8044"><input type="hidden" name="preview" value="true"><label>Rechercher un article<input name="recherche" value="' . esc_attr($search) . '"></label><label>Catégorie<select name="categorie"><option value="0">Toutes les catégories</option>';
    foreach (get_categories(array('hide_empty' => true)) as $category) $html .= '<option value="' . (int) $category->term_id . '" ' . selected($cat, $category->term_id, false) . '>' . esc_html($category->name) . '</option>';
    $html .= '</select></label><button>Rechercher</button></form><div class="scipt-blog-grid">';
    while ($q->have_posts()) { $q->the_post(); $id = get_the_ID();
        $html .= '<article><a href="' . esc_url(scipt_portal_url(8044, array('article' => $id))) . '">' . get_the_post_thumbnail($id, 'medium_large') . '<h2>' . esc_html(get_the_title()) . '</h2></a><p class="scipt-blog-meta">' . esc_html(get_the_date()) . ' · ' . esc_html(get_the_author()) . '</p><p>' . esc_html(wp_trim_words(wp_strip_all_tags(get_the_excerpt()), 35)) . '</p><a href="' . esc_url(scipt_portal_url(8044, array('article' => $id))) . '">Lire l’article →</a></article>';
    }
    if (!$q->post_count) $html .= '<p>Aucun article pour cette recherche.</p>';
    $html .= '</div><nav aria-label="Pages du blog">';
    for ($i = 1; $i <= $q->max_num_pages; $i++) $html .= '<a href="' . esc_url(scipt_portal_url(8044, array('scipt_blog_page' => $i, 'recherche' => $search, 'categorie' => $cat))) . '">' . $i . '</a> ';
    wp_reset_postdata(); return $html . '</nav><section class="scipt-blog-discover"><h2>À découvrir dans notre médiathèque</h2><div class="scipt-blog-grid"><article><video controls playsinline preload="none" poster="https://raw.githubusercontent.com/Lionel-Johnson/scipt-refonte/main/assets/videos/scipt-video-09.jpg" src="https://raw.githubusercontent.com/Lionel-Johnson/scipt-refonte/main/assets/videos/scipt-video-09.mp4"></video><h3>Formations professionnelles</h3><p>Découvrez les métiers et les parcours de nos écoles.</p><a href="' . esc_url(scipt_portal_url(7509)) . '">Visitez nos Formations Professionnelles →</a></article><article><img src="https://raw.githubusercontent.com/Lionel-Johnson/scipt-refonte/main/assets/atelier-parcours.png" alt="Formation professionnelle pratique" loading="lazy"><h3>Parcours de 18 mois</h3><p>Explorez les filières et leurs conditions d’admission.</p><a href="' . esc_url(scipt_portal_url(7911)) . '">Découvrir les formations →</a></article><article><video controls playsinline preload="none" poster="https://raw.githubusercontent.com/Lionel-Johnson/scipt-refonte/main/assets/videos/scipt-video-06.jpg" src="https://raw.githubusercontent.com/Lionel-Johnson/scipt-refonte/main/assets/videos/scipt-video-06.mp4"></video><h3>Validation des Acquis de l’Expérience</h3><p>Découvrez la VAE et la valorisation de votre expérience.</p><a href="' . esc_url(scipt_portal_url(7945)) . '">Découvrir la VAE →</a></article></div></section></div>';
});
add_filter('comment_post_redirect', function ($url, $comment) { return scipt_portal_url(8044, array('article' => $comment->comment_post_ID)) . '#comments'; }, 10, 2);

add_shortcode('scipt_inscription', function () {
    if (!shortcode_exists('multi-step-form')) return '<p>Le formulaire d’admission doit être activé par l’équipe.</p>';
    return '<div class="scipt-portal scipt-admission-form">' . do_shortcode('[multi-step-form id="3"]') . '</div>';
});

// Pièces jointes aux commentaires : aucun lien externe n’est demandé.
add_filter('comment_form_defaults', function ($defaults) {
    $defaults['comment_field'] .= '<p><label for="scipt-comment-file">Ajouter une photo ou une vidéo</label><input id="scipt-comment-file" name="scipt_comment_file" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"><small>JPG, PNG, WebP, MP4 ou WebM — maximum 20 Mo. Le fichier est examiné avant diffusion.</small></p>' . wp_nonce_field('scipt_comment_file', 'scipt_file_nonce', true, false);
    return $defaults;
});
add_action('pre_comment_on_post', function () {
    if (empty($_FILES['scipt_comment_file']) || $_FILES['scipt_comment_file']['error'] === UPLOAD_ERR_NO_FILE) return;
    $nonce = isset($_POST['scipt_file_nonce']) ? sanitize_text_field(wp_unslash($_POST['scipt_file_nonce'])) : '';
    $dir = scipt_private_directory();
    $rate = 'scipt_comment_' . hash_hmac('sha256', isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '', wp_salt());
    $attempts = (int) get_transient($rate);
    if ($attempts >= 5) wp_die('Trop de tentatives. Réessayez dans une heure.');
    set_transient($rate, $attempts + 1, HOUR_IN_SECONDS);
    $f = $_FILES['scipt_comment_file'];
    if (!wp_verify_nonce($nonce, 'scipt_comment_file') || !$dir || $f['error'] !== UPLOAD_ERR_OK || $f['size'] > min(20 * MB_IN_BYTES, wp_max_upload_size()) || !is_uploaded_file($f['tmp_name'])) wp_die('Le fichier n’a pas pu être reçu. Réessayez ou envoyez votre commentaire sans pièce jointe.');
    $types = array('jpg|jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'mp4' => 'video/mp4', 'webm' => 'video/webm');
    $check = wp_check_filetype_and_ext($f['tmp_name'], $f['name'], $types);
    if (!$check['ext'] || !$check['type'] || !class_exists('finfo') || (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']) !== $check['type']) wp_die('Format de fichier non accepté.');
    if (strpos($check['type'], 'image/') === 0 && !getimagesize($f['tmp_name'])) wp_die('Image non valide.');
    $file = wp_generate_uuid4() . '.' . $check['ext'];
    if (!move_uploaded_file($f['tmp_name'], $dir . DIRECTORY_SEPARATOR . $file)) wp_die('Envoi impossible pour le moment.');
    chmod($dir . DIRECTORY_SEPARATOR . $file, 0600);
    $GLOBALS['scipt_comment_upload'] = array('filename' => $file, 'type' => $check['type']);
});
add_filter('pre_comment_approved', function ($approved) { return empty($GLOBALS['scipt_comment_upload']) ? $approved : 0; });
add_action('comment_post', function ($id) {
    if (!empty($GLOBALS['scipt_comment_upload'])) {
        add_comment_meta($id, '_scipt_file', $GLOBALS['scipt_comment_upload'], true);
        unset($GLOBALS['scipt_comment_upload']);
    }
});
add_action('shutdown', function () {
    if (!empty($GLOBALS['scipt_comment_upload']) && ($dir = scipt_private_directory())) {
        $path = $dir . DIRECTORY_SEPARATOR . $GLOBALS['scipt_comment_upload']['filename'];
        if (is_file($path)) unlink($path);
    }
});
add_action('admin_post_scipt_comment_file', 'scipt_comment_file');
add_action('admin_post_nopriv_scipt_comment_file', 'scipt_comment_file');
function scipt_comment_file() {
    $id = isset($_GET['id']) ? absint($_GET['id']) : 0;
    $comment = get_comment($id);
    if (!$comment || (!current_user_can('moderate_comments') && ($comment->comment_approved !== '1' || get_post_status($comment->comment_post_ID) !== 'publish'))) wp_die('Accès refusé.', '', array('response' => 403));
    $file = get_comment_meta($id, '_scipt_file', true); $dir = scipt_private_directory();
    if (!$file || !$dir || basename($file['filename']) !== $file['filename']) wp_die('Fichier indisponible.');
    $path = $dir . DIRECTORY_SEPARATOR . $file['filename']; if (!is_file($path)) wp_die('Fichier indisponible.');
    nocache_headers(); header('X-Content-Type-Options: nosniff'); header('Content-Type: ' . $file['type']); header('Content-Length: ' . filesize($path)); readfile($path); exit;
}
add_filter('comment_text', function ($text, $comment) {
    if ($comment && get_comment_meta($comment->comment_ID, '_scipt_file', true)) $text .= '<p><a href="' . esc_url(admin_url('admin-post.php?action=scipt_comment_file&id=' . $comment->comment_ID)) . '">Voir la pièce jointe</a></p>';
    return $text;
}, 10, 2);
add_action('delete_comment', function ($id) {
    $file = get_comment_meta($id, '_scipt_file', true); $dir = scipt_private_directory();
    if ($file && $dir && basename($file['filename']) === $file['filename']) { $path = $dir . DIRECTORY_SEPARATOR . $file['filename']; if (is_file($path)) unlink($path); }
});

// L’URL existante conserve ses traitements et reçoit l’en-tête de la refonte.
add_filter('template_include', function ($template) {
    if (is_page(2550) && !is_feed()) return get_stylesheet_directory() . '/scipt-account-page.php';
    return $template;
}, 99);

require_once __DIR__ . '/scipt-performances.php';
