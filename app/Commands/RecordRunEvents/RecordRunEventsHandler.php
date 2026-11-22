<?php

declare(strict_types=1);

namespace App\Commands\RecordRunEvents;

use App\Commands\AssessPartOutput\AssessPartOutputCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Reads\OutputRecorder;
use App\Enums\RunEventType;
use App\Models\PartRun;
use App\Models\ProcessRun;
use App\Support\Execution\RecordedRunEvents;
use App\Support\RunUpdates;
use App\Values\RunEvent;
use App\Values\RunEventBatch;

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

        if (array_any($batch, fn (RunEvent $event): bool => $event->type->isTerminal())) {
            foreach ($processRun->parts()->readLimit(500)->get() as $part) {
                $this->updates->settled($part);
            }
        }

        return count($batch);
    }
}
