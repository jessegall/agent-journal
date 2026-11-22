<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Attributes\RequiresListener;
use App\Contracts\Event;
use App\Support\ActorIdentity;
use Domain\Tasks\Enums\TaskState;

/**
 * A task run started for an agent and session, raised by the task inside the transaction that started it. Plans
 * reads the started task's plan and moves its phase tallies from the state the task left in that transaction; its
 * listeners are named as text so Tasks does not depend on Plans. It names the id of its entry in the task's history.
 */
#[RequiresListener('Domain\Plans\Listeners\CountPhaseTaskStates')]
#[RequiresListener('Domain\Plans\Listeners\SamplePlanOfStartedTask')]
final readonly class TaskStarted implements Event
{
    public function __construct(
        public string $taskId,
        public ActorIdentity $actor,
        public TaskState $previousState,
        public string $historyEntryId,
    ) {}
}
