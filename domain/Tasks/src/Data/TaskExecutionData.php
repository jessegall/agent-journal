<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Values\TaskExecution;
use Spatie\LaravelData\Data;

/**
 * Who works on a task's run, as an agent's list gives it.
 *
 * @method static static from(TaskExecution|array<string, mixed> $payload)
 */
final class TaskExecutionData extends Data
{
    public function __construct(
        public readonly string $actorType,
        public readonly string $actorId,
        public readonly string|null $actorLabel,
        public readonly int $runNumber,
        public readonly TaskStatus $state,
    ) {}

    public static function fromExecution(TaskExecution $execution): self
    {
        return new self(
            $execution->actorType,
            $execution->actorId,
            $execution->actorLabel,
            $execution->runNumber,
            $execution->state,
        );
    }

    /**
     * The run as one line of text.
     */
    public function label(): string
    {
        return "run {$this->runNumber} by ".($this->actorLabel
            ?? "{$this->actorType} {$this->actorId}").", {$this->state->value}";
    }
}
