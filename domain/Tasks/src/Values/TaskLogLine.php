<?php

declare(strict_types=1);

namespace Domain\Tasks\Values;

use Carbon\CarbonImmutable;

/**
 * One line of a task's log: the run it was written in, who wrote it, its text, its place in the task's order, and
 * when.
 */
final readonly class TaskLogLine
{
    public function __construct(
        public string $id,
        public int $runNumber,
        public string $actorType,
        public string $actorId,
        public string $text,
        public int $sequence,
        public CarbonImmutable $at,
    ) {}
}
