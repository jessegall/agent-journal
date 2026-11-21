<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\RecordRunEventsCall;
use App\Processes\Calls\RunEventsAccepted;
use App\Processes\Commands\AssessPartOutput;
use App\Processes\Contracts\OutputRecorder;
use App\Processes\Enums\RunEventType;
use App\Processes\Execution\RecordedRunEvents;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\RunUpdates;
use App\Processes\Values\RunEvent;

/**
 * Records a batch of a run's events for the holder of its event key, assesses the parts that ended and settles them
 * once the run ends.
 */
final readonly class RecordRunEventsController
{
    public function __invoke(
        RecordRunEventsCall $call,
        ProcessRun $processRun,
        OutputRecorder $recorder,
        CommandBus $commands,
        RunUpdates $updates,
    ): RunEventsAccepted {
        abort_unless($processRun->acceptsEventKey($call->eventKey), 403, 'This event key is not the run\'s.');
        $events = new RecordedRunEvents($processRun, $recorder);

        foreach ($call->events as $event) {
            if ($event->type === RunEventType::Heartbeat) {
                $processRun->recordHeartbeat();

                continue;
            }

            $event->applyTo($events->at($event->sequence));
        }

        foreach (PartRun::query()->endedUnassessedOf($processRun)->limit(100)->get() as $ended) {
            $commands->run(new AssessPartOutput($ended->id));
        }

        if (array_any($call->events, fn (RunEvent $event): bool => $event->type->isTerminal())) {
            foreach ($processRun->parts()->readLimit(500)->get() as $part) {
                $updates->settled($part);
            }
        }

        return new RunEventsAccepted(count($call->events));
    }
}
