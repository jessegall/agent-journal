<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Processes\RunEventsRequest;
use App\Processes\Commands\AssessPartOutput;
use App\Processes\Contracts\OutputRecorder;
use App\Processes\Enums\RunEventType;
use App\Processes\Execution\RecordedRunEvents;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\RunUpdates;
use Illuminate\Http\JsonResponse;

/**
 * Applies a batch of a run's events in order; only a caller with the run's event key is heard, and a repeated event
 * changes nothing.
 */
final readonly class RecordRunEventsController
{
    public function __invoke(
        RunEventsRequest $request,
        ProcessRun $processRun,
        OutputRecorder $recorder,
        CommandBus $commands,
        RunUpdates $updates,
    ): JsonResponse {
        abort_unless($processRun->acceptsEventKey($request->eventKey()), 403, 'This event key is not the run\'s.');
        $events = new RecordedRunEvents($processRun, $recorder);
        foreach ($request->events() as $event) {
            if ($event->type === RunEventType::Heartbeat) {
                $processRun->recordHeartbeat();

                continue;
            }
            $event->applyTo($events->at($event->sequence));
        }

        foreach (PartRun::query()->endedUnassessedOf($processRun)->readLimit(100)->get() as $ended) {
            $commands->run(new AssessPartOutput($ended->id));
        }
        if (array_any($request->events(), fn ($event): bool => $event->type->isTerminal())) {
            foreach ($processRun->parts()->readLimit(500)->get() as $part) {
                $updates->settled($part);
            }
        }

        return new JsonResponse(['accepted' => count($request->events())]);
    }
}
