<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\RecordRunEventsCall;
use App\Processes\Calls\RunEventsAccepted;
use App\Processes\Commands\RecordRunEvents;
use App\Processes\Models\ProcessRun;
use App\Processes\Values\RunEventBatch;

/**
 * Records a batch of a run's events for the holder of its event key, assesses the parts that ended and settles them
 * once the run ends.
 */
final readonly class RecordRunEventsController
{
    public function __invoke(
        RecordRunEventsCall $call,
        ProcessRun $processRun,
        CommandBus $commands,
    ): RunEventsAccepted {
        abort_unless($processRun->acceptsEventKey($call->eventKey), 403, 'This event key is not the run\'s.');

        $events = new RunEventBatch($call->events)->toJson();

        return new RunEventsAccepted($commands->run(new RecordRunEvents($processRun->id, $events)));
    }
}
