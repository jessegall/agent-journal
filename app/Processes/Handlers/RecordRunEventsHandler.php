<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Processes\Commands\AssessPartOutput;
use App\Processes\Commands\RecordRunEvents;
use App\Processes\Contracts\OutputRecorder;
use App\Processes\Enums\RunEventType;
use App\Processes\Execution\RecordedRunEvents;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\RunUpdates;
use App\Processes\Values\RunEvent;
use App\Processes\Values\RunEventBatch;

final readonly class RecordRunEventsHandler implements CommandHandler
{
    public function __construct(
        private OutputRecorder $recorder,
        private CommandBus $commands,
        private RunUpdates $updates,
    ) {}

    public function handle(RecordRunEvents $command): int
    {
        $processRun = ProcessRun::query()->findOrFail($command->processRunId);
        $events = new RecordedRunEvents($processRun, $this->recorder);
        $batch = RunEventBatch::from(json_decode($command->events, true, flags: JSON_THROW_ON_ERROR))->events;

        foreach ($batch as $event) {
            if ($event->type === RunEventType::Heartbeat) {
                $processRun->recordHeartbeat();

                continue;
            }

            $event->applyTo($events->at($event->sequence));
        }

        foreach (PartRun::query()->endedUnassessedOf($processRun)->limit(100)->get() as $ended) {
            $this->commands->run(new AssessPartOutput($ended->id));
        }

        if (array_any($batch, fn (RunEvent $event): bool => $event->type->isTerminal())) {
            foreach ($processRun->parts()->readLimit(500)->get() as $part) {
                $this->updates->settled($part);
            }
        }

        return count($batch);
    }
}
