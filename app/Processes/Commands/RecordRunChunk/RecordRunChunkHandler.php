<?php

declare(strict_types=1);

namespace App\Processes\Commands\RecordRunChunk;

use App\Contracts\CommandHandler;
use App\Processes\Contracts\OutputRecorder;
use App\Processes\Execution\RecordedRunEvents;
use App\Processes\Models\ProcessRun;
use App\Processes\Values\PartKey;

final readonly class RecordRunChunkHandler implements CommandHandler
{
    public function __construct(private OutputRecorder $recorder) {}

    public function handle(RecordRunChunkCommand $command): int
    {
        $events = new RecordedRunEvents(ProcessRun::query()->findOrFail($command->processRunId), $this->recorder);
        $part = new PartKey($command->node, $command->attempt, $command->operation);
        $stored = $events->outputOffset($part, $command->stream);

        if ($command->offset < $stored) {
            return $stored;
        }

        $bytes = (string) base64_decode($command->bytes, true);
        $events->output($part, $command->stream, $bytes);

        return $command->offset + strlen($bytes);
    }
}
