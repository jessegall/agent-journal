<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Setup\Contracts\SignInEnvironment;

/**
 * Claude Code reads its account from the folder alone, and a PATH whose security(1) always fails keeps it from a
 * macOS Keychain, so its login stays in the folder's .credentials.json on every host.
 */
final readonly class ClaudeCodeSignInEnvironment implements SignInEnvironment
{
    private const string NO_KEYCHAIN = 'tools/accounts/no-keychain';

    public function __invoke(string $directory): array
    {
        return [
            'PATH' => base_path(self::NO_KEYCHAIN).PATH_SEPARATOR.(string) getenv('PATH'),
            'HOME' => $directory,
            'CLAUDE_CONFIG_DIR' => $directory,
        ];
    }
}
