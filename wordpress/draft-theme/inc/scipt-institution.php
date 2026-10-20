<?php
/** Référentiel et composants communs de la refonte institutionnelle. */
defined('ABSPATH') || exit;
function scipt_institution_registry() {
    static $data;
    if ($data === null) {
        $path = get_stylesheet_directory() . '/assets/institution-pages.json';
        $data = is_readable($path) ? json_decode(file_get_contents($path), true) : array();
        if (!is_array($data)) $data = array();
        /* Source du Blog validée sur GitHub, chargée uniquement dans le thème de prévisualisation. */
        $blog_path = get_stylesheet_directory() . '/assets/blog-main.html';
        if (is_readable($blog_path)) {
            if (!isset($data['pages']) || !is_array($data['pages'])) $data['pages'] = array();
            $data['pages']['blog'] = file_get_contents($blog_path);
        }
        $editorial_path = get_stylesheet_directory() . '/assets/presentations-pages.json';
        if (is_readable($editorial_path)) {
            $editorial = json_decode(file_get_contents($editorial_path), true);
            if (is_array($editorial['pages'] ?? null)) {
                $data['pages'] = array_replace($data['pages'] ?? array(), $editorial['pages']);
            }
        }
        $stages_path = get_stylesheet_directory() . '/assets/stages-pages.json';
        if (is_readable($stages_path)) {
            $stages = json_decode(file_get_contents($stages_path), true);
            if (is_array($stages['pages'] ?? null)) {
                $data['pages'] = array_replace($data['pages'] ?? array(), $stages['pages']);
            }
        }
    }
    return $data;
}
function scipt_institution_page_map() {
    return array('index'=>7837,'a-propos'=>7890,'programme'=>7891,'ecole-scipt-international'=>7881,'medias'=>7845,'admissions'=>7841,'programmes-universitaires'=>7839,'formations-professionnelles'=>7509,'ecole-sante-developpement'=>7805,'ecole-sciences-technologies-ingenierie'=>7803,'ecole-droit-sciences-gestion'=>7801,'ecole-sciences-humaines-communication'=>8076,'actualites'=>7511,'contact'=>7512,'candidature'=>7903,'certifications-internationales'=>7904,'orientation'=>7906,'partenaires'=>7907,'verification-diplomes'=>7908,'vie-etudiante'=>7909,'diplomes-specialisations'=>7910,'formations-professionnelles-18-mois'=>7911,'vae'=>7945,'qui-sommes-nous'=>8039,'agrement-reconnaissance'=>8040,'pourquoi-nous-choisir'=>8041,'approche-pedagogique'=>8042,'corps-professoral'=>8043,'blog'=>8044,'connexion'=>8045,'mentions-legales'=>7905);
}
function scipt_institution_menu($html, $id, $replacement) {
    $pattern = '~<div\b[^>]*\bid=["\x27]' . preg_quote($id, '~') . '["\x27][^>]*>~i';
    if (!preg_match($pattern, $html, $open, PREG_OFFSET_CAPTURE)) return $html;
    $start = $open[0][1] + strlen($open[0][0]);
    $depth = 1;
    preg_match_all('~</?div\b[^>]*>~i', substr($html, $start), $tags, PREG_OFFSET_CAPTURE);
    foreach ($tags[0] as $tag) {
        $depth += stripos($tag[0], '</div') === 0 ? -1 : 1;
        if ($depth === 0) return substr_replace($html, $replacement, $start, $tag[1]);
    }
    return $html;
}
function scipt_institution_transform($html) {
    $data = scipt_institution_registry();
    foreach (($data['menus'] ?? array()) as $id => $markup) $html = scipt_institution_menu($html, $id, $markup);
    // Complément du menu À propos, y compris pour les en-têtes Elementor existants.
    $html = preg_replace_callback('~(<ul\b[^>]*\bid="menu-about"[^>]*>)(.*?)(</ul>)~s', function ($m) {
        if (strpos($m[2], '#chiffres-cles') !== false) return $m[0];
        return $m[1] . $m[2] . '<li><a class="dropdown-item" href="qui-sommes-nous.html#chiffres-cles">SCIPT INTERNATIONAL en chiffres</a></li>' . $m[3];
    }, $html);
    $map = scipt_institution_page_map();
    $html = preg_replace_callback('~href="([a-z0-9-]+)\.html([^"<>]*)"~i', function ($m) use ($map) {
        if (!isset($map[$m[1]])) return $m[0];
        $parts = wp_parse_url(html_entity_decode($m[2], ENT_QUOTES));
        $args = array();
        if (!empty($parts['query'])) parse_str($parts['query'], $args);
        if (strpos(get_stylesheet(), 'wpvibe-draft') !== false && isset($_GET['wpvibe_preview'])) {
            $args['page_id'] = $map[$m[1]];
            $args['wpvibe_preview'] = sanitize_text_field(wp_unslash($_GET['wpvibe_preview']));
            $url = add_query_arg($args, home_url('/'));
        } else {
            $url = scipt_portal_url($map[$m[1]], $args);
        }
        if (!empty($parts['fragment'])) $url .= '#' . $parts['fragment'];
        return 'href="' . esc_url($url) . '"';
    }, $html);
    $html = str_replace('src="assets/', 'src="https://lionel-johnson.github.io/scipt-refonte/assets/', $html);
    $html = preg_replace_callback('~<a\\b([^>]*\\bclass="[^"]*\\bscipt-catalogue-link\\b[^"]*"[^>]*)>.*?</a>~s', function ($m) {
        $label = strpos($m[1], 'programmes-universitaires') !== false || strpos($m[1], 'page_id=7839') !== false ? 'Programmes Universitaire' : 'Formation Professionnelles';
        return '<a' . $m[1] . '>' . $label . '</a>';
    }, $html);
    $html = str_replace(array('Afficher les écoles : Visitez nos Programmes Universitaires', 'Afficher les écoles : Visitez nos Formations Professionnelles', 'Afficher les écoles : Découvrez nos Programmes Universitaires', 'Afficher les écoles : Découvrez nos Formations Professionnelles'), array('Afficher les écoles : Programmes Universitaire', 'Afficher les écoles : Formation Professionnelles', 'Afficher les écoles : Programmes Universitaire', 'Afficher les écoles : Formation Professionnelles'), $html);
    return str_replace(array('quatre écoles académiques et une École Doctorale Internationale SCIPT', 'quatre écoles académiques', 'Quatre écoles académiques', '4 écoles académiques', 'Visitez nos Programmes Universitaires', 'Visitez nos Formations Professionnelles'), array('cinq écoles', 'cinq écoles', 'Cinq écoles', '5 écoles', 'Découvrez nos Programmes Universitaires', 'Découvrez nos Formations Professionnelles'), $html);
}
add_filter('elementor/widget/render_content', 'scipt_institution_transform', 90);
add_filter('the_content', 'scipt_institution_transform', 90);
function scipt_institution_requested_page_id() {
    if (strpos(get_stylesheet(), 'wpvibe-draft') !== false && isset($_GET['page_id'])) {
        $requested = absint($_GET['page_id']);
        if (in_array($requested, scipt_institution_page_map(), true)) return $requested;
    }
    $id = get_queried_object_id();
    // Prévisualisation du thème uniquement : accès aux fragments explicitement préparés.
    if (!$id && strpos(get_stylesheet(), 'wpvibe-draft') !== false && isset($_GET['page_id'])) $id = absint($_GET['page_id']);
    return $id;
}
add_filter('template_include', function ($template) {
    $map = scipt_institution_page_map();
    $data = scipt_institution_registry();
    foreach (($data['pages'] ?? array()) as $name => $html) {
        if (isset($map[$name]) && scipt_institution_requested_page_id() === $map[$name]) {
            status_header(200);
            nocache_headers();
            return get_stylesheet_directory() . '/scipt-institution-page.php';
        }
    }
    return $template;
}, 100);
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('scipt-institution', get_stylesheet_directory_uri() . '/assets/institution.css', array(), '20261020-stages');
    wp_enqueue_style('scipt-presentations-client', get_stylesheet_directory_uri() . '/assets/presentations-client.css', array('scipt-institution'), '20261020-ecoles');
    wp_enqueue_style('scipt-school-videos', get_stylesheet_directory_uri() . '/assets/videos-accueil.css', array(), '20261016-media-parcours');
    wp_enqueue_script('scipt-media-data', get_stylesheet_directory_uri() . '/assets/medias-formations-data.js', array(), '20261020-stages', true);
    wp_enqueue_script('scipt-institution', get_stylesheet_directory_uri() . '/assets/institution.js', array('scipt-media-data'), '20261020-stages', true);
    wp_enqueue_script('scipt-presentations-client', get_stylesheet_directory_uri() . '/assets/presentations-client.js', array(), '20261019-glass', true);
    if (scipt_institution_requested_page_id() === 7891) {
        $public_assets = 'https://lionel-johnson.github.io/scipt-refonte/assets/';
        $previous = array('scipt-media-data');
        foreach (array('diplomes-specialisations','professionnel-18-mois-data','programme-contenus','programmes-ecoles','formation-hero','fiches-data','fiche-formation','diplomes-specialisations-ui','professionnel-18-mois-ui','programmes-maquettes-data','programmes-detail-modern') as $script) {
            $handle = 'scipt-programme-' . $script;
            $url = $script === 'formation-hero' ? get_stylesheet_directory_uri() . '/assets/formation-hero.js' : $public_assets . $script . '.js';
            wp_enqueue_script($handle, $url, $previous, '20261020-stages', true);
            $previous = array($handle);
        }
        wp_enqueue_style('scipt-formation-hero', $public_assets . 'formation-hero.css', array(), '20261020-stages');
        wp_enqueue_style('scipt-programmes-detail', $public_assets . 'programmes-detail-modern.css', array(), '20261020-stages');
    }
});

add_filter('pre_get_document_title', function ($title) {
    $name = array_search(scipt_institution_requested_page_id(), scipt_institution_page_map(), true);
    $data = scipt_institution_registry();
    if ($name && isset($data['pages'][$name])) return get_the_title(scipt_institution_requested_page_id()) . ' — SCIPT INTERNATIONAL';
    return $title;
}, 9999);

/* Blog, navigation et filtres de programmes (prévisualisation du thème). */
add_action('wp_enqueue_scripts', function () {
    $root = get_stylesheet_directory_uri() . '/assets/';
    wp_enqueue_style('scipt-blog-refresh', $root . 'scipt-blog-refresh.css', array(), '20261016-blog');
    wp_enqueue_script('scipt-nav-fix', $root . 'scipt-nav-fix.js', array(), '20261016-blog', true);
    if (scipt_institution_requested_page_id() === 8044) {
        wp_enqueue_script('scipt-blog-programmes', $root . 'blog-programmes-data.js', array(), '20261016-blog', true);
        wp_enqueue_script('scipt-blog-refresh', $root . 'blog.js', array('scipt-blog-programmes'), '20261016-blog', true);
    }
}, 30);
