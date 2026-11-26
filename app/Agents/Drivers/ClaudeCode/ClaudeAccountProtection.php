<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

/**
 * The private per-start Claude Code settings that protect saved accounts: file tools may not read an account's sign-in
 * or change the accounts folder, and the Keychain and sign-in commands are refused. Other
 * sessions' history is the journal's own per-session check.
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
            'permissions' => ['deny' => [...$deny, ...self::SIGN_IN_COMMANDS]],
        ], JSON_UNESCAPED_SLASHES);
    }
}
