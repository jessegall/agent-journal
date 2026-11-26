<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\RecordRunEventsPayload;
use App\Api\Processes\RunEventsAccepted;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Models\Runs\ProcessRun;
use App\Processes\Commands\RecordRunEvents\RecordRunEventsCommand;
use App\Processes\Values\RunEventBatch;

/**
 * Records a batch of a run's events for the holder of its event key, assesses the parts that ended and settles them
 * once the run ends.
 */
final readonly class RecordRunEventsController
{
    #[Dispatches(RecordRunEventsCommand::class)]
    public function __invoke(
        RecordRunEventsPayload $call,
        ProcessRun $processRun,
        CommandBus $commands,
    ): RunEventsAccepted {
        abort_unless($processRun->acceptsEventKey($call->eventKey), 403, 'This event key is not the run\'s.');

        $events = RunEventBatch::from(['events' => $call->events])->toJson();

        return new RunEventsAccepted($commands->run(new RecordRunEventsCommand($processRun->id, $events)));
    }
}
