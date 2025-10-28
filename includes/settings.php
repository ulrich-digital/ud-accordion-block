<?php
defined('ABSPATH') || exit;

/**
 * Fügt eine Einstellungsseite unter "Einstellungen > Akkordeon" hinzu,
 * auf der auswählbar ist, welche Blöcke im Akkordeon erlaubt sind.
 */

// Menüpunkt im WP-Admin
add_action('admin_menu', function () {
	add_options_page(
		'Akkordeon Einstellungen',              // Seitentitel
		'Akkordeon',                            // Menüname
		'manage_options',                       // Berechtigung
		'ud-accordion-settings',                // Slug
		'ud_accordion_render_settings_page'     // Callback
	);
});

// Registriere die Option
add_action('admin_init', function () {
	register_setting('ud_accordion_settings_group', 'ud_accordion_allowed_blocks');
});

function ud_accordion_render_settings_page() {
$registered_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();

$excluded_blocks = [
	'core/legacy-widget',
	'core/widget-group',
	'core/archives',
	'core/avatar',
	'core/block',
	'core/categories',
	'core/comment-author-name',
	'core/comment-content',
	'core/comment-date',
	'core/comment-edit-link',
	'core/comment-reply-link',
	'core/comment-template',
	'core/comments',
	'core/comments-pagination',
	'core/comments-pagination-next',
	'core/comments-pagination-numbers',
	'core/comments-pagination-previous',
	'core/comments-title',
	'core/cover',
	'core/file',
	'core/footnotes',
	'core/gallery',
	'core/home-link',
	'core/image',
	'core/latest-comments',
	'core/latest-posts',
	'core/loginout',
	'core/media-text',
	'core/navigation',
	'core/navigation-link',
	'core/navigation-submenu',
	'core/page-list',
	'core/page-list-item',
	'core/post-author',
	'core/post-author-biography',
	'core/post-author-name',
	'core/post-comments-form',
	'core/post-content',
	'core/post-date',
	'core/post-excerpt',
	'core/post-featured-image',
	'core/post-navigation-link',
	'core/post-template',
	'core/post-terms',
	'core/post-title',
	'core/query',
	'core/query-no-results',
	'core/query-pagination',
	'core/query-pagination-next',
	'core/query-pagination-numbers',
	'core/query-pagination-previous',
	'core/query-title',
	'core/query-total',
	'core/read-more',
	'core/rss',
	'core/search',
	'core/site-logo',
	'core/site-tagline',
	'core/site-title',
	'core/social-link',
	'core/tag-cloud',
	'core/template-part',
	'core/term-description',
	'core/column',
	'core/columns',
	'core/details',
	'core/embed',
	'core/freeform',
	'core/missing',
	'core/more',
	'core/nextpage',
	'core/preformatted',
	'core/pullquote',
	'core/quote',
	'core/separator',
	'core/social-links',
	'core/text-columns',
	'core/verse',
	'core/post-comments',
];

// Filtere sie raus
$registered_blocks = array_filter(
	$registered_blocks,
	fn($block, $key) => !in_array($key, $excluded_blocks, true),
	ARRAY_FILTER_USE_BOTH
);
	$current = get_option('ud_accordion_allowed_blocks', []);
	$current = is_array($current) ? $current : [];

	?>
	<div class="wrap">
		<h1>Akkordeon: Erlaubte Blöcke</h1>
		<p>Wähle aus, welche Blöcke im Akkordeon eingefügt werden dürfen.</p>

		<form method="post" action="options.php">
			<?php settings_fields('ud_accordion_settings_group'); ?>
			<?php do_settings_sections('ud_accordion_settings_group'); ?>

			<table class="form-table">
				<tr valign="top">
					<th scope="row">Erlaubte Blöcke</th>
					<td style="max-height: 300px; overflow-y: auto; border: 1px solid #ccc; padding: 1em;">
						<?php foreach ($registered_blocks as $block_name => $block): ?>
							<label style="display: block; margin-bottom: 3px;">
								<input
									type="checkbox"
									name="ud_accordion_allowed_blocks[]"
									value="<?php echo esc_attr($block_name); ?>"
									<?php checked(in_array($block_name, $current, true)); ?>
								/>
								<?php echo esc_html($block_name); ?>
							</label>
						<?php endforeach; ?>
					</td>
				</tr>
			</table>

			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}
