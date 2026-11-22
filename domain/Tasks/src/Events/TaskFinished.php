<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Attributes\RequiresTransactionListener;
use App\Contracts\Events\Event;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Support\Sources\Contracts\DockSourceChanged;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;

/**
 * A task finished. Raised only once the change has committed; it names the state the task left, so a
 * tally of task states moves by one, and the id of its entry in the task's history, so a reader takes it once. Plans keeps its phase tallies in the same transaction.
 */
#[RequiresTransactionListener('Domain\Plans\Listeners\CountPhaseTaskStates')]
final readonly class TaskFinished implements
    DockSourceChanged,
    Event,
    UserInterfaceUpdater
{
    public function __construct(
        public string $taskId,
        public TaskState $previousState,
        public string $historyEntryId,
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
