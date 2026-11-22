<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

use Domain\Tasks\Events\TaskCancelled;
use Tests\Fixtures\Domains\Tasks\States\Commands\RecordCancelledTask\RecordCancelledTaskCommand;

/**
 * Replaces the cancellation method with an ordinary override.
 */
final class OrdinaryTaskWatchState extends TaskWatchState
{
    public function onTaskCancelled(TaskCancelled $event): RecordCancelledTaskCommand|null
    {
        return parent::onTaskCancelled($event);
    }
}
