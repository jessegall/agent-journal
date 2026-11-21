<?php

declare(strict_types=1);

namespace App\Hooks\Drivers;

/**
 * The private settings each Codex thread on a saved account starts with: one sandbox, writable only where the thread
 * works, and a shell environment that never names the account folder. Codex 0.165.0 has no native rule that hides the
 * account's auth.json from a reading command, so CODEX_HOME is no isolation by itself: the journal refuses commands and
 * patches that reach the accounts folder, also while it is away, and the arrangement stays refused until the
 * protected host shows those denials hold.
 */
final class CodexAccountProtection
{
    private const array HIDDEN_VARIABLES = ['CODEX_HOME', 'JOURNAL_ACCOUNTS_ROOT', 'OPENAI_API_KEY', 'CODEX_API_KEY'];

    public static function settingsFor(): string
    {
        return (string) json_encode([
            'sandbox' => 'workspace-write',
            'config' => [
                'shell_environment_policy' => ['exclude' => self::HIDDEN_VARIABLES],
                'mcp_servers' => (object) [],
            ],
        ], JSON_UNESCAPED_SLASHES);
    }
}
