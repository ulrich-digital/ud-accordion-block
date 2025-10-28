<?php

/**
 * Registrierung des Akkordeon-Blocks
 */

defined('ABSPATH') || exit;

function ud_register_accordion_block() {
    register_block_type_from_metadata(__DIR__ . '/../');
}
add_action('init', 'ud_register_accordion_block');


register_block_style(
    'ud/accordion-block',
    [
        'name'  => 'chips',
        'label' => 'Chips',
    ]
);
