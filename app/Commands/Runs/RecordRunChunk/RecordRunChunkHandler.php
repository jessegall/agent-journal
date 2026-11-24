<?php

declare(strict_types=1);

namespace App\Commands\Runs\RecordRunChunk;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Reads\OutputRecorder;
use App\Models\Runs\ProcessRun;
use App\Support\Execution\RecordedRunEvents;
use App\Values\PartKey;

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
