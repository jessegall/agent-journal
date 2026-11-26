<?php

declare(strict_types=1);

namespace App\Processes\Commands\RecordRunEvents;

use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandHandler;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Processes\Commands\AssessPartOutput\AssessPartOutputCommand;
use App\Processes\Enums\RunEventType;
use App\Processes\Execution\RecordedRunEvents;
use App\Processes\RunUpdates;
use App\Processes\Values\RunEvent;
use App\Processes\Values\RunEventBatch;
use App\Reads\Contracts\OutputRecorder;

final readonly class RecordRunEventsHandler implements CommandHandler
{
    public function __construct(
        private OutputRecorder $recorder,
        private CommandBus $commands,
        private RunUpdates $updates,
    ) {}

    public function handle(RecordRunEventsCommand $command): int
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
            $this->commands->run(new AssessPartOutputCommand($ended->id));
        }

        if (array_any($batch, fn (RunEvent $event) => $event->type->isTerminal())) {
            foreach ($processRun->parts()->readLimit(500)->get() as $part) {
                $this->updates->settled($part);
            }
        }

        return count($batch);
    }
}
