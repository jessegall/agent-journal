<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Models\Runs\ProcessRun;
use App\Processes\Api\ChunkStored;
use App\Processes\Api\RecordRunChunkPayload;
use App\Processes\Commands\RecordRunChunk\RecordRunChunkCommand;

/**
 * Stores one piece of a part's output for the holder of the run's event key, once.
 */
final readonly class RecordRunChunkController
{
    #[Dispatches(RecordRunChunkCommand::class)]
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
