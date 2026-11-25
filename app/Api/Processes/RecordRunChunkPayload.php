<?php

declare(strict_types=1);

namespace App\Api\Processes;

use App\Attributes\Api\Endpoint;
use App\Attributes\Api\InPath;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use Spatie\LaravelData\Attributes\FromRouteParameterProperty;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Data;

/**
 * Sends one spooled piece of a part's output under the run's event key; a piece the journal already stored is
 * answered with how far the stream is stored, and nothing is written twice.
 *
 * @implements ApiPayload<ChunkStored>
 */
#[Endpoint('processes/runs/{processRun}/chunks', 'POST', ChunkStored::class, ApiEffect::SequencedWrite)]
final class RecordRunChunkPayload extends Data implements ApiPayload
{
    public function __construct(
        #[InPath, FromRouteParameterProperty('processRun', 'id')]
        public readonly string $processRun,
        #[MapName('key'), Size(64)]
        public readonly string $eventKey,
        public readonly RunChunk $chunk,
    ) {}
}
