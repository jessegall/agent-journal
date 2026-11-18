<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

use App\Actors\Enums\ActorType;
use Domain\Tasks\Enums\TaskWorkState;

/**
 * Who works on a task now, apart from who holds it: the actor and its label (null when the caller may not see that
 * agent's name), the run, and how that run stands.
 */
final readonly class TaskExecution
{
    public function __construct(
        public ActorType $actorType,
        public string $actorId,
        public string|null $actorLabel,
        public int $runNumber,
        public TaskWorkState $workState,
    ) {}
}
