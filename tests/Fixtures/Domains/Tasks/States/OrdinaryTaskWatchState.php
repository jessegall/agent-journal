<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

use App\Support\Decisions\Decision;
use App\Attributes\StateType;
use App\Enums\Sessions\SessionTransferType;
use Domain\Tasks\Events\TaskCancelled;
use Tests\Fixtures\Domains\Tasks\States\Commands\RecordTaskCancelled\RecordTaskCancelledCommand;

/**
 * Replaces the cancellation method with an ordinary override.
 */
#[StateType('tasks.ordinary_task_watch', schemaVersion: 1, transfer: SessionTransferType::Durable)]
final class OrdinaryTaskWatchState extends TaskWatchState
{
    public function onTaskCancelled(TaskCancelled $event): RecordTaskCancelledCommand|Decision
    {
        return parent::onTaskCancelled($event);
    }
}
