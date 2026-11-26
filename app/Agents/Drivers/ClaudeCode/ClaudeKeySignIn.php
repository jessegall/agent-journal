<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Enums\Accounts\SignInMethod;
use App\Enums\Files\Permissions;
use App\Enums\Files\Place;
use App\Values\FilePath;
use App\Values\SignInCard;
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

    protected function method(): SignInMethod
    {
        return SignInMethod::ApiKey;
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

        return $this->files->readJson($file);
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

    public function card(): SignInCard
    {
        return new SignInCard(
            'API key',
            'Paste a key from the Anthropic Console.',
            'Billed to the API key, apart from any subscription.'.SignInCard::CHECK_SENDS_A_REQUEST,
            'In the Anthropic Console, open API keys and create a key. Copy it right away: the Console shows it only '
                .'once.',
        );
    }
}
