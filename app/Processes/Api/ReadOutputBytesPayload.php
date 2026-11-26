<?php

declare(strict_types=1);

namespace App\Processes\Api;

use App\Attributes\Api\Endpoint;
use App\Attributes\Api\InPath;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Processes\Enums\OutputStream;
use Spatie\LaravelData\Attributes\FromRouteParameterProperty;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * Reads a part's whole stream; the read is recorded as evidence read.
 *
 * @implements ApiPayload<OutputBytes>
 */
#[Endpoint('processes/runs/{processRun}/output/bytes', 'POST', OutputBytes::class, ApiEffect::Read)]
final class ReadOutputBytesPayload extends Data implements ApiPayload
{
    public function __construct(
        #[InPath, FromRouteParameterProperty('processRun', 'id')]
        public readonly string $processRun,
        #[Min(0)]
        public readonly int $part = 0,
        public readonly OutputStream $stream = OutputStream::Stdout,
    ) {}
}
