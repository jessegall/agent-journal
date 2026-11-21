<?php

declare(strict_types=1);

namespace App\Drivers\Enums;

use App\Drivers\Values\DriverKey;
use App\Drivers\Values\ProviderKey;

/**
 * The agent programs whose hooks the journal answers, as they appear in the hook endpoint's address.
 */
enum HookDriver: string
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
     * helpers and workers are ever started (rule 36). The names are those plan 26's start evidence found per build.
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

    /**
     * The allow rules that let the program call the journal's own MCP tools without a native prompt: the literal
     * journal server prefix and never a wildcard for another server. Codex approves its journal entry in its account
     * configuration instead.
     *
     * @return list<string>
     */
    public function journalToolRules(): array
    {
        return match ($this) {
            self::ClaudeCode => ['mcp__journal__*'],
            self::Codex => [],
        };
    }

    public function driverKey(): DriverKey
    {
        return DriverKey::from($this->value);
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

    /**
     * The program's name as people read it, such as on an account named after it.
     */
    /**
     * Whether an address is one of the program's own sign-in pages: HTTPS, on the provider's sign-in hosts or below
     * them. A sign-in shows the user no other link.
     */
    public function isSignInAddress(string $address): bool
    {
        $parts = parse_url($address);
        $host = strtolower((string) ($parts['host'] ?? ''));

        if (($parts['scheme'] ?? '') !== 'https' || isset($parts['user']) || isset($parts['port']) || $host === '') {
            return false;
        }

        $hosts = match ($this) {
            self::ClaudeCode => ['claude.ai', 'claude.com', 'anthropic.com'],
            self::Codex => ['auth.openai.com', 'chatgpt.com'],
        };

        foreach ($hosts as $trusted) {
            if ($host === $trusted || str_ends_with($host, '.'.$trusted)) {
                return true;
            }
        }

        return false;
    }

    public function displayName(): string
    {
        return match ($this) {
            self::ClaudeCode => 'Claude Code',
            self::Codex => 'Codex',
        };
    }

    /**
     * The name the protected host knows the program by, as its profiles and its start protocol write it.
     */
    public function hostName(): string
    {
        return match ($this) {
            self::ClaudeCode => 'claude',
            self::Codex => 'codex',
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

    /**
     * Whether a transcript file name is that of the native conversation: Claude Code writes <session id>.jsonl,
     * Codex rollout-<time>-<session id>.jsonl.
     */
    public function namesTranscriptOf(string $fileName, string $nativeId): bool
    {
        return match ($this) {
            self::ClaudeCode => $fileName === $nativeId.'.jsonl',
            self::Codex => str_starts_with($fileName, 'rollout-') && str_ends_with($fileName, '-'.$nativeId.'.jsonl'),
        };
    }

    /**
     * Whether the program saves a conversation's large tool outputs in a folder named for it beside its transcript;
     * Claude Code does, Codex keeps them in the transcript.
     */
    public function keepsOutputsBesideTranscript(): bool
    {
        return $this === self::ClaudeCode;
    }
}
