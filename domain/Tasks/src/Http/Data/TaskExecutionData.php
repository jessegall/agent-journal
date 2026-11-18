<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Data;

use Domain\Tasks\Api\TaskExecution;
use Domain\Tasks\Enums\TaskWorkState;
use Spatie\LaravelData\Data;

/**
 * Who works on a task's run, as an agent's list gives it.
 *
 * @method static static from(TaskExecution|array<string, mixed> $payload)
 */
final class TaskExecutionData extends Data
{
    public function __construct(
        public readonly string $agentId,
        public readonly string|null $agentLabel,
        public readonly string $sessionId,
        public readonly int $runNumber,
        public readonly TaskWorkState $workState,
    ) {}

    public static function fromExecution(TaskExecution $execution): self
    {
        return new self($execution->agentId, $execution->agentLabel, $execution->sessionId, $execution->runNumber, $execution->workState);
    }

    /**
     * The run as one line of text.
     */
    public function label(): string
    {
        return "run {$this->runNumber} by ".($this->agentLabel ?? "agent {$this->agentId}")." in session {$this->sessionId}, {$this->workState->value}";
    }
}
