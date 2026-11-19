<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Data;

use App\Actors\Enums\ActorType;
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
        public readonly ActorType $actorType,
        public readonly string $actorId,
        public readonly string|null $actorLabel,
        public readonly int $runNumber,
        public readonly TaskWorkState $workState,
    ) {}

    public static function fromExecution(TaskExecution $execution): self
    {
        return new self(
            $execution->actorType,
            $execution->actorId,
            $execution->actorLabel,
            $execution->runNumber,
            $execution->workState,
        );
    }

    /**
     * The run as one line of text.
     */
    public function label(): string
    {
        return "run {$this->runNumber} by ".($this->actorLabel
            ?? "{$this->actorType->value} {$this->actorId}").", {$this->workState->value}";
    }
}
