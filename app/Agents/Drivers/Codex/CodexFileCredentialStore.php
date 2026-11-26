<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\Setup\Contracts\SignInPreparation;
use App\Files\Contracts\Files;
use App\Files\Enums\Permissions;
use App\Files\Enums\Place;

/**
 * Codex keeps its sign-in in the folder's own auth.json, never a keyring shared with other accounts or the user's own
 * login: the folder's config.toml says so before every run.
 */
final readonly class CodexFileCredentialStore implements SignInPreparation
{
    private const string SETTING = 'cli_auth_credentials_store = "file"';

    public function __construct(private Files $files) {}

    public function __invoke(string $directory): void
    {
        $file = $this->files->pathIn(Place::Accounts, $directory)->child('config.toml');
        $config = $this->files->exists($file) ? $this->files->read($file) : '';

        $config = preg_match('/^\s*cli_auth_credentials_store\s*=/m', $config) === 1
            ? (string) preg_replace('/^\s*cli_auth_credentials_store\s*=.*$/m', self::SETTING, $config)
            : self::SETTING.PHP_EOL.$config;

        $this->files->write($file, $config, Permissions::OwnerOnly);
    }
}
