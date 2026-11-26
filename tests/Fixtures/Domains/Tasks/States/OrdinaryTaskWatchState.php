<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

use App\Stacks\Attributes\StateType;
use App\Stacks\Contracts\Work\DurableState;
use App\Support\Decisions\Decision;
use Domain\Tasks\Events\TaskCancelled;
use Tests\Fixtures\Domains\Tasks\States\Commands\RecordTaskCancelled\RecordTaskCancelledCommand;

/**
 * Replaces the cancellation method with an ordinary override.
 */
#[StateType(OrdinaryTaskWatchStateReference::class, schemaVersion: 1)]
final class OrdinaryTaskWatchState extends TaskWatchState implements DurableState
{
    public function onTaskCancelled(TaskCancelled $event): RecordTaskCancelledCommand|Decision
    {
        return parent::onTaskCancelled($event);
    }
}
