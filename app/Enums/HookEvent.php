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

    /**
     * Whether the agent goes on after the event and so reads context a reply carries. After SessionEnd nobody reads
     * it, and a driver refuses a reply that carries any.
     */
    public function hasReaderAfterIt(): bool
    {
        return match ($this) {
            self::SessionStart, self::UserPromptSubmit, self::PreToolUse, self::PostToolUse, self::Stop => true,
            self::StopFailure, self::SessionEnd => false,
        };
    }
}
