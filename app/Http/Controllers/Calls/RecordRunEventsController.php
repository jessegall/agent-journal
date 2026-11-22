<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\RecordRunEventsCall;
use App\Calls\Processes\RunEventsAccepted;
use App\Commands\RecordRunEvents\RecordRunEventsCommand;
use App\Contracts\CommandBus;
use App\Models\ProcessRun;
use App\Values\RunEventBatch;

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

        $events = RunEventBatch::from(['events' => $call->events])->toJson();

        return new RunEventsAccepted($commands->run(new RecordRunEventsCommand($processRun->id, $events)));
    }
}
