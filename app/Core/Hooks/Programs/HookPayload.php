<?php

declare(strict_types=1);

namespace App\Core\Hooks\Programs;

use App\Core\Hooks\Exceptions\UnreadablePayload;
use App\Core\Hooks\Inputs\SessionStartSource;
use App\Core\Hooks\Inputs\ToolOutcome;
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
        public readonly string|Optional $source = new Optional,
        public readonly string|Optional $prompt = new Optional,
        public readonly string|Optional $toolName = new Optional,
        public readonly array|Optional $toolInput = new Optional,
        public readonly array|Optional $toolResponse = new Optional,
        public readonly bool|Optional $stopHookActive = new Optional,
        public readonly string|Optional $reason = new Optional,
    ) {}

    public function isSessionStart(): bool
    {
        return $this->hookEventName === 'SessionStart';
    }

    public function promptText(): string
    {
        return $this->present($this->prompt, 'prompt');
    }

    public function toolNameText(): string
    {
        return $this->present($this->toolName, 'tool_name');
    }

    public function reasonText(): string
    {
        return $this->present($this->reason, 'reason');
    }

    public function startSource(): SessionStartSource
    {
        $source = $this->present($this->source, 'source');

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

    public function toolOutcome(): ToolOutcome
    {
        $response = $this->toolResponse instanceof Optional ? [] : $this->toolResponse;

        return ($response['is_error'] ?? false) === true ? ToolOutcome::Failed : ToolOutcome::Succeeded;
    }

    private function present(string|Optional $value, string $field): string
    {
        return $value instanceof Optional ? throw UnreadablePayload::missing($field) : $value;
    }
}
