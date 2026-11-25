<?php

declare(strict_types=1);

namespace Domain\Tasks\Values;

use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskState;

/**
 * One committed change of a task, as its history keeps it for good: the run it belonged to (none for a change outside
 * a run), who made it, the state it left and the one it entered, the exact reason or note, its place in the task's
 * order, and when.
 */
final readonly class TaskTransition
{
    public function __construct(
        public string $id,
        public int|null $runNumber,
        public string $actorType,
        public string $actorId,
        public TaskState $fromState,
        public TaskState $toState,
        public string|null $text,
        public int $sequence,
        public CarbonImmutable $at,
    ) {}
}
