<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Processes\Calls\ChunkStored;
use App\Processes\Calls\RecordRunChunkCall;
use App\Processes\Contracts\OutputRecorder;
use App\Processes\Execution\RecordedRunEvents;
use App\Processes\Models\ProcessRun;

/**
 * Stores one piece of a part's output for the holder of the run's event key, once.
 */
final readonly class RecordRunChunkController
{
    public function __invoke(RecordRunChunkCall $call, ProcessRun $processRun, OutputRecorder $recorder): ChunkStored
    {
        abort_unless($processRun->acceptsEventKey($call->eventKey), 403, 'This event key is not the run\'s.');
        $chunk = $call->chunk;
        $events = new RecordedRunEvents($processRun, $recorder);
        $part = $chunk->part->key();
        $stored = $events->outputOffset($part, $chunk->stream);

        if ($chunk->offset < $stored) {
            return new ChunkStored($stored);
        }

        $bytes = $chunk->decodedBytes();
        $events->output($part, $chunk->stream, $bytes);

        return new ChunkStored($chunk->offset + strlen($bytes));
    }
}
