<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\ChunkStored;
use App\Processes\Calls\RecordRunChunkCall;
use App\Processes\Commands\RecordRunChunk;
use App\Processes\Models\ProcessRun;

/**
 * Stores one piece of a part's output for the holder of the run's event key, once.
 */
final readonly class RecordRunChunkController
{
    public function __invoke(RecordRunChunkCall $call, ProcessRun $processRun, CommandBus $commands): ChunkStored
    {
        abort_unless($processRun->acceptsEventKey($call->eventKey), 403, 'This event key is not the run\'s.');

        $chunk = $call->chunk;

        return new ChunkStored($commands->run(new RecordRunChunk(
            $processRun->id,
            $chunk->part->node,
            $chunk->part->attempt,
            $chunk->part->operation,
            $chunk->stream,
            $chunk->offset,
            $chunk->bytes,
        )));
    }
}
