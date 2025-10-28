<?php
/**
 * Plugin Name:     UD Block: Akkordion
 * Description:     Block mit aufklappbaren Bereichen und Unterstützung für verschachtelte WordPress-Blöcke.
 * Version:         1.0.0
 * Author:          ulrich.digital gmbh
 * Author URI:      https://ulrich.digital/
 * License:         GPL v2 or later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     accordion-block-ud
 */

/**
 * Hinweis:
 * Diese Datei dient ausschliesslich als Einstiegspunkt für das Plugin.
 */

defined('ABSPATH') || exit;

foreach ([
    'settings.php',
    'helpers.php',           // Allgemeine Hilfsfunktionen
    'block-register.php',    // Block-Registrierung via block.json
    'enqueue.php'            // Enqueue von Styles/Scripts
    //'render.php'
] as $file) {
    require_once __DIR__ . '/includes/' . $file;
}

// Beispiel für zukünftige Einstellungen
/*
add_filter('plugin_action_links_' . plugin_basename(__FILE__), function ($links) {
    $url = admin_url('options-general.php?page=accordion_settings');
    $settings_link = '<a href="' . esc_url($url) . '">Einstellungen</
*/