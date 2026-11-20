<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use stdClass;

/**
 * Claude Code signed in by an API key: the account folder's own settings.json names an apiKeyHelper that prints the
 * key's file, and the status says api_key_helper.
 */
final readonly class ClaudeKeySignIn extends ClaudeSecretSignIn
{
    protected function secretFile(string $directory): string
    {
        return $directory.'/api-key';
    }

    protected function authMethod(): string
    {
        return 'api_key_helper';
    }

    protected function install(string $directory): void
    {
        $settings = self::settingsOf($directory);
        $settings['apiKeyHelper'] = 'cat '.escapeshellarg($this->secretFile($directory));
        self::saveSettings($directory, $settings);
    }

    protected function uninstall(string $directory): void
    {
        $settings = self::settingsOf($directory);
        unset($settings['apiKeyHelper']);
        self::saveSettings($directory, $settings);
    }

    protected function variables(string $directory): array
    {
        return [];
    }

    protected function readFiles(string $directory): array
    {
        return [];
    }

    /**
     * @return array<string, mixed>
     */
    private static function settingsOf(string $directory): array
    {
        $file = $directory.'/settings.json';
        $settings = is_file($file) ? json_decode((string) file_get_contents($file), true) : [];

        return is_array($settings) ? $settings : [];
    }

    /**
     * @param  array<string, mixed>  $settings
     */
    private static function saveSettings(string $directory, array $settings): void
    {
        $content = $settings === [] ? new stdClass() : $settings;
        $encoded = json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
        file_put_contents($directory.'/settings.json', $encoded);
    }
}
