<?php

declare(strict_types=1);

namespace App\Programs\Enums;

use App\Programs\Values\ProgramKey;
use App\Programs\Values\ProviderKey;

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
            self::ClaudeCode => [
                'SessionStart',
                'UserPromptSubmit',
                'PreToolUse',
                'PostToolUse',
                'Stop',
                'StopFailure',
                'SessionEnd',
            ],
            self::Codex => ['SessionStart', 'UserPromptSubmit', 'PreToolUse', 'PostToolUse', 'Stop', 'SessionEnd'],
        };
    }

    /**
     * The program's own tools that start or reach another agent; they are always denied, since only the journal's
     * helpers and workers are ever started (rule 36). The names are those plan 26's launch evidence found per build.
     *
     * @return list<string>
     */
    public function nativeChildTools(): array
    {
        return match ($this) {
            self::ClaudeCode => ['Agent', 'Task', 'Workflow', 'SendMessage', 'ListAgents', 'RemoteTrigger', 'Skill'],
            self::Codex => [
                'collaboration.spawn_agent',
                'collaboration.wait_agent',
                'collaboration.send_message',
                'collaboration.followup_task',
                'collaboration.interrupt_agent',
                'collaboration.list_agents',
            ],
        };
    }

    public function programKey(): ProgramKey
    {
        return ProgramKey::from($this->value);
    }

    /**
     * The provider family the program runs on, as its registration gives it; never read from a model name.
     */
    public function provider(): ProviderKey
    {
        return match ($this) {
            self::ClaudeCode => ProviderKey::from('anthropic'),
            self::Codex => ProviderKey::from('openai'),
        };
    }

    public function hookCommand(): string
    {
        return "journal-hook {$this->value}";
    }

    /**
     * The arguments that start this program on the selected model: Claude Code 2.1.323 and codex-cli 0.165.0 both take
     * --model (docs/hooks/program-capabilities.md).
     *
     * @return list<string>
     */
    public function modelArguments(string $model): array
    {
        return ['--model', $model];
    }
}
