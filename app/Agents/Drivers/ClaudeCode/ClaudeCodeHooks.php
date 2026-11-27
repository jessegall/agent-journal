<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Values\RelayedHookCommand;

/**
 * The hooks block of a Claude Code settings file: every event the journal answers runs the hook command with its
 * driver name and reply file, the same in the session's settings and in a container's managed settings.
 */
final readonly class ClaudeCodeHooks
{
    /**
     * The hook events the journal answers.
     */
    private const array EVENTS = [
        'SessionStart',
        'UserPromptSubmit',
        'PreToolUse',
        'PostToolUse',
        'Stop',
        'SessionEnd',
    ];

    /**
     * The name the hook relay is told the driver by.
     */
    private const string DRIVER_NAME = 'claude-code';

    /**
     * @return array<string, list<array{hooks: list<array{type: string, command: string}>}>>
     */
    public static function running(string $command): array
    {
        $hook = [['hooks' => [[
            'type' => 'command',
            'command' => RelayedHookCommand::for($command, self::DRIVER_NAME)->text,
        ]]]];

        return array_fill_keys(self::EVENTS, $hook);
    }
}
