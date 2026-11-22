<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * A native hook event Claude Code and Codex send, by the name they send it under.
 */
enum HookEvent: string
{
    case SessionStart = 'SessionStart';
    case UserPromptSubmit = 'UserPromptSubmit';
    case PreToolUse = 'PreToolUse';
    case PostToolUse = 'PostToolUse';
    case Stop = 'Stop';
    case StopFailure = 'StopFailure';
    case SessionEnd = 'SessionEnd';

    /**
     * Whether the event comes before a tool runs, the one event a tool call can be allowed or denied at.
     */
    public function isToolCall(): bool
    {
        return $this === self::PreToolUse;
    }

    public function isSessionStart(): bool
    {
        return $this === self::SessionStart;
    }
}
