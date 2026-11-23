<?php

declare(strict_types=1);

namespace App\Support\Drivers;

/**
 * The private per-start Claude Code settings that protect saved accounts natively: file tools may neither read the
 * account's sign-in, settings and diagnostics nor change anything in the accounts folder, the shell runs sandboxed
 * with no unsandboxed escape, and the Keychain and the sign-in commands are refused. Which other sessions' history a
 * file tool reads is the journal's per-session check, since a native rule cannot tell sessions apart.
 */
final class ClaudeAccountProtection
{
    private const array SECRET_ITEMS = [
        '.credentials.json',
        '.claude.json',
        'settings.json',
        'settings.local.json',
        'statsig',
        'logs',
        'debug',
        'shell-snapshots',
    ];

    private const array SIGN_IN_COMMANDS = [
        'Bash(security:*)',
        'Bash(secret-tool:*)',
        'Bash(claude auth:*)',
        'Bash(claude login:*)',
        'Bash(claude logout:*)',
        'Bash(claude setup-token:*)',
    ];

    public static function settingsFor(string $directory, string $accountsRoot): string
    {
        $deny = [];

        foreach (self::SECRET_ITEMS as $secretField) {
            $path = rtrim($directory, '/').'/'.$secretField;
            array_push($deny, "Read(/{$path})", "Read(/{$path}/**)", "Edit(/{$path})", "Edit(/{$path}/**)");
        }

        $deny[] = 'Edit(/'.rtrim($accountsRoot, '/').'/**)';

        return (string) json_encode([
            'permissions' => [
                'deny' => [...$deny, ...self::SIGN_IN_COMMANDS],
            ],
            'sandbox' => [
                'enabled' => true,
                'autoAllowBashIfSandboxed' => false,
                'allowUnsandboxedCommands' => false,
            ],
        ], JSON_UNESCAPED_SLASHES);
    }
}
