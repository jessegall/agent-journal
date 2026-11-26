<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

/**
 * The private settings each Codex thread on a saved account starts with: a shell environment that never names the
 * account folder. Codex has no native rule hiding auth.json, so the
 * journal refuses commands and patches that reach the accounts folder.
 */
final class CodexAccountProtection
{
    private const array HIDDEN_VARIABLES = [
        'CODEX_HOME',
        'JOURNAL_ACCOUNTS_ROOT',
        'OPENAI_API_KEY',
        'CODEX_API_KEY',
    ];

    public static function settingsFor(): string
    {
        return (string) json_encode([
            'config' => [
                'shell_environment_policy' => ['exclude' => self::HIDDEN_VARIABLES],
                'mcp_servers' => (object) [],
            ],
        ], JSON_UNESCAPED_SLASHES);
    }
}
