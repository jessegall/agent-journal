<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Attributes\Endpoint;
use App\Attributes\InPath;
use App\Contracts\JournalCall;
use App\Enums\CallEffect;
use Spatie\LaravelData\Attributes\FromRouteParameterProperty;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Data;

/**
 * Sends one spooled piece of a part's output under the run's event key; a piece the journal already stored is
 * answered with how far the stream is stored, and nothing is written twice.
 *
 * @implements JournalCall<ChunkStored>
 */
#[Endpoint('processes/runs/{processRun}/chunks', 'POST', ChunkStored::class, CallEffect::SequencedWrite)]
final class RecordRunChunkCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameterProperty('processRun', 'id')]
        public readonly string $processRun,
        #[MapName('key'), Size(64)]
        public readonly string $eventKey,
        public readonly RunChunk $chunk,
    ) {}
}
