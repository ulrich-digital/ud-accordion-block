<?php
/**
 * Enqueue styles and scripts for block editor and frontend
 */

defined('ABSPATH') || exit;

add_action('enqueue_block_editor_assets', function () {
    wp_localize_script(

   'ud-accordion-block-editor-script', // ✅ korrekt!
        'udAccordionBlockSettings',
        [
            'nonce' => wp_create_nonce('wp_rest'),
			'allowedBlocks' => get_option('ud_accordion_allowed_blocks', []),

        ]
    );
});

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style(
        'ud-fontawesome',
        plugins_url('assets/fonts/fontawesome.bundle.css', dirname(__FILE__)),
        [],
        filemtime(plugin_dir_path(__FILE__) . '../assets/fonts/fontawesome.bundle.css')
    );
});


add_action('enqueue_block_editor_assets', function () {
    wp_enqueue_style(
        'ud-fontawesome-editor',
        plugins_url('assets/fonts/fontawesome.bundle.css', dirname(__FILE__)),
        [],
        filemtime(plugin_dir_path(__FILE__) . '../assets/fonts/fontawesome.bundle.css')
    );
});
