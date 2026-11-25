<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\ChunkStored;
use App\Api\Processes\RecordRunChunkPayload;
use App\Commands\Runs\RecordRunChunk\RecordRunChunkCommand;
use App\Contracts\Bus\CommandBus;
use App\Models\Runs\ProcessRun;

/**
 * Stores one piece of a part's output for the holder of the run's event key, once.
 */
final readonly class RecordRunChunkController
{
    public function __invoke(RecordRunChunkPayload $call, ProcessRun $processRun, CommandBus $commands): ChunkStored
    {
        abort_unless($processRun->acceptsEventKey($call->eventKey), 403, 'This event key is not the run\'s.');

        $chunk = $call->chunk;

        return new ChunkStored($commands->run(new RecordRunChunkCommand(
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
