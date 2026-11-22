<?php

declare(strict_types=1);

namespace Domain\Tasks\Values;

use App\Enums\ActorType;
use Domain\Tasks\Enums\TaskState;

/**
 * Who works on a task now, apart from who holds it: the actor and its label (null when the caller may not see that
 * agent's name), the run, how that run stands, and whether it runs now: a started current run with a live claim.
 */
final readonly class TaskExecution
{
    public function __construct(
        public ActorType $actorType,
        public string $actorId,
        public string|null $actorLabel,
        public int $runNumber,
        public TaskState $state,
        public bool $isRunningNow,
    ) {}
}
