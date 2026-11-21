<?php

declare(strict_types=1);

namespace Domain\Tasks\Api\Events;

use App\Contracts\Event;
use App\Docking\Sources\Contracts\DockSourceChanged;
use Domain\Tasks\Models\Task;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A task was cancelled. Raised only once the change has committed.
 */
final readonly class TaskCancelled implements DockSourceChanged, Event, ShouldDispatchAfterCommit
{
    public function __construct(public string $taskId) {}

    public function dockType(): string
    {
        return Task::LINK_TYPE;
    }

    public function dockId(): string
    {
        return $this->taskId;
    }
}
