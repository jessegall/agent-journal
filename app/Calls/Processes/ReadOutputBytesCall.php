<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Attributes\Endpoint;
use App\Attributes\InPath;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use App\Enums\Processes\OutputStream;
use Spatie\LaravelData\Attributes\FromRouteParameterProperty;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * Reads a part's whole stream; the read is recorded as evidence read.
 *
 * @implements JournalCall<OutputBytes>
 */
#[Endpoint('processes/runs/{processRun}/output/bytes', 'POST', OutputBytes::class, CallEffect::Read)]
final class ReadOutputBytesCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameterProperty('processRun', 'id')]
        public readonly string $processRun,
        #[Min(0)]
        public readonly int $part = 0,
        public readonly OutputStream $stream = OutputStream::Stdout,
    ) {}
}
