<?php

declare(strict_types=1);

namespace App\Core\Hooks\Enums;

/**
 * The agent programs whose hooks the journal answers, as they appear in the hook endpoint's address.
 */
enum HookProgram: string
{
    case ClaudeCode = 'claude-code';
    case Codex = 'codex';

    /**
     * The native hook events this program's adapter maps, which its isolated settings register.
     *
     * @return list<string>
     */
    public function nativeEvents(): array
    {
        return match ($this) {
            self::ClaudeCode => ['SessionStart', 'UserPromptSubmit', 'PreToolUse', 'PostToolUse', 'Stop', 'SessionEnd'],
            self::Codex => ['SessionStart', 'UserPromptSubmit', 'PreToolUse', 'PostToolUse', 'Stop', 'SessionEnd'],
        };
    }

    /**
     * The program's own tools that start a child with no identity of its own; they stay off until one is verified.
     *
     * @return list<string>
     */
    public function childToolsWithoutIdentity(): array
    {
        return match ($this) {
            self::ClaudeCode => ['Agent', 'Task'],
            self::Codex => [],
        };
    }

    public function hookCommand(): string
    {
        return "journal-hook {$this->value}";
    }
}
