<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Support\Inputs\StopRequested;
use Domain\Tasks\Events\TaskStarted as Started;

/**
 * Hook and listener methods a state can inherit or replace.
 */
trait InheritedHandlers
{
    public function onStop(StopRequested $input): null
    {
        return null;
    }

    public function onTaskStarted(Started $event): null
    {
        return null;
    }
}
