<?php

declare(strict_types=1);

namespace Domain\Tasks\Api\Events;

use App\Contracts\Attributes\RequiresListener;
use App\Contracts\Event;
use App\Docking\Sources\Contracts\DockSourceChanged;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A task finished. Raised only once the change has committed; it names the state the task left, so a
 * tally of task states moves by one. Plans keeps its phase tallies in the same transaction.
 */
#[RequiresListener('Domain\Plans\Listeners\CountPhaseTaskStates')]
final readonly class TaskFinished implements DockSourceChanged, Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $taskId,
        public TaskState $previousState,
    ) {}

    public function dockType(): string
    {
        return Task::LINK_TYPE;
    }

    public function dockId(): string
    {
        return $this->taskId;
    }
}
