<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Files\Enums\Permissions;
use App\Files\Enums\Place;
use App\Files\Exceptions\FileJsonInvalid;
use App\Files\Values\FilePath;
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
        $settings = $this->settingsOf($directory);
        $settings['apiKeyHelper'] = 'cat '.escapeshellarg($this->secretFile($directory));
        $this->saveSettings($directory, $settings);
    }

    protected function uninstall(string $directory): void
    {
        $settings = $this->settingsOf($directory);
        unset($settings['apiKeyHelper']);
        $this->saveSettings($directory, $settings);
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
    private function settingsOf(string $directory): array
    {
        $file = $this->settingsFile($directory);

        if (! $this->files->exists($file)) {
            return [];
        }

        try {
            return $this->files->readJson($file);
        } catch (FileJsonInvalid) {
            return [];
        }
    }

    /**
     * @param  array<string, mixed>  $settings
     */
    private function saveSettings(string $directory, array $settings): void
    {
        $content = $settings === [] ? new stdClass() : $settings;
        $encoded = json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
        $this->files->write($this->settingsFile($directory), $encoded, Permissions::OwnerOnly);
    }

    private function settingsFile(string $directory): FilePath
    {
        return $this->files->pathIn(Place::Accounts, $directory)->child('settings.json');
    }
}
