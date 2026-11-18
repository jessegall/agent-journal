<?php

declare(strict_types=1);

namespace App\Hooks\Programs;

use App\Hooks\Enums\SessionEndReason;
use App\Hooks\Enums\SessionStartSource;
use App\Hooks\Enums\ToolOutcome;
use App\Hooks\Exceptions\UnreadablePayload;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Optional;

/**
 * The JSON a Claude Code or Codex hook sends on standard input. Fields that belong to some events only are Optional,
 * and reading one that is missing refuses the call by name instead of guessing a value.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class HookPayload extends Data
{
    /**
     * @param  array<string, mixed>|Optional  $toolInput
     * @param  array<string, mixed>|Optional  $toolResponse
     */
    public function __construct(
        public readonly string $hookEventName,
        public readonly string $sessionId,
        public readonly string|Optional $source = new Optional(),
        public readonly string|Optional $prompt = new Optional(),
        public readonly string|Optional $toolName = new Optional(),
        public readonly array|Optional $toolInput = new Optional(),
        public readonly array|string|Optional $toolResponse = new Optional(),
        public readonly bool|Optional $stopHookActive = new Optional(),
        public readonly string|Optional $reason = new Optional(),
        public readonly string|Optional $agentId = new Optional(),
        public readonly string|Optional $promptId = new Optional(),
        public readonly string|Optional $turnId = new Optional(),
    ) {}

    /**
     * The program's own id of the prompt this call belongs to: Claude Code's prompt_id, Codex's turn_id (plan 26
     * task 883). Null when the program sent none; the journal never invents one.
     */
    public function nativePromptId(): string|null
    {
        return match (true) {
            is_string($this->promptId) => $this->promptId,
            is_string($this->turnId) => $this->turnId,
            default => null,
        };
    }

    /**
     * Whether the call comes from inside a program's own native child, which carries the child's agent id.
     */
    public function isFromNativeChild(): bool
    {
        return is_string($this->agentId) && $this->agentId !== '';
    }

    /**
     * Whether the call is about to run one of the named tools.
     *
     * @param  list<string>  $toolNames
     */
    public function callsAnyOf(array $toolNames): bool
    {
        return $this->hookEventName === 'PreToolUse' && is_string($this->toolName) && in_array($this->toolName, $toolNames, true);
    }

    public function isSessionStart(): bool
    {
        return $this->hookEventName === 'SessionStart';
    }

    public function promptText(): string
    {
        return $this->required($this->prompt, 'prompt');
    }

    public function toolNameText(): string
    {
        return $this->required($this->toolName, 'tool_name');
    }

    public function reasonText(): string
    {
        return $this->required($this->reason, 'reason');
    }

    /**
     * Why the session ended, read from the reason both programs send on SessionEnd.
     */
    public function endReason(): SessionEndReason
    {
        return match ($this->reasonText()) {
            'clear' => SessionEndReason::Clear,
            'logout' => SessionEndReason::Logout,
            'prompt_input_exit' => SessionEndReason::Exit,
            'other' => SessionEndReason::Other,
            default => throw UnreadablePayload::forValue('reason', $this->reasonText()),
        };
    }

    public function startSource(): SessionStartSource
    {
        $source = $this->required($this->source, 'source');

        return SessionStartSource::tryFrom($source) ?? throw UnreadablePayload::forValue('source', $source);
    }

    public function isStopContinuation(): bool
    {
        return $this->stopHookActive === true;
    }

    /**
     * @return array<string, mixed>
     */
    public function toolArguments(): array
    {
        return $this->toolInput instanceof Optional ? throw UnreadablePayload::missing('tool_input') : $this->toolInput;
    }

    /**
     * The first of the named tool arguments that holds text.
     */
    public function argument(string ...$names): string
    {
        $arguments = $this->toolArguments();

        foreach ($names as $name) {
            if (is_string($arguments[$name] ?? null)) {
                return $arguments[$name];
            }
        }

        throw UnreadablePayload::missing(implode(' or ', $names));
    }

    /**
     * Whether the tool failed: Claude Code answers with an object that may say is_error, Codex with the tool's text,
     * which starts with its exit code when the tool reports one.
     */
    public function toolOutcome(): ToolOutcome
    {
        if (is_string($this->toolResponse)) {
            $exitCode = preg_match('/^Exit code: (\d+)/', $this->toolResponse, $match) === 1 ? (int) $match[1] : 0;

            return $exitCode === 0 ? ToolOutcome::Succeeded : ToolOutcome::Failed;
        }

        $response = $this->toolResponse instanceof Optional ? [] : $this->toolResponse;

        return ($response['is_error'] ?? false) === true ? ToolOutcome::Failed : ToolOutcome::Succeeded;
    }

    private function required(string|Optional $value, string $field): string
    {
        return $value instanceof Optional ? throw UnreadablePayload::missing($field) : $value;
    }
}
