<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

use App\Hooks\Values\EventCommands;
use Domain\Tasks\Api\Events\TaskCancelled;

/**
 * Replaces the cancellation method with an ordinary override.
 */
final class OrdinaryTaskWatchState extends TaskWatchState
{
    public function onTaskCancelled(TaskCancelled $event): EventCommands
    {
        return parent::onTaskCancelled($event);
    }
}
