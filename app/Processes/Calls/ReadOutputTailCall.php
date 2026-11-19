<?php

declare(strict_types=1);

namespace App\Processes\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Attributes\InPath;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\Processes\Enums\OutputStream;
use Spatie\LaravelData\Attributes\FromRouteParameterProperty;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * Reads the last lines of a part's stream; the read is recorded as evidence read.
 *
 * @implements JournalCall<OutputTail>
 */
#[Endpoint('processes/runs/{processRun}/output/tail', 'POST', OutputTail::class, CallEffect::Read)]
final class ReadOutputTailCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameterProperty('processRun', 'id')]
        public readonly string $processRun,
        #[Min(0)]
        public readonly int $part = 0,
        public readonly OutputStream $stream = OutputStream::Stdout,
        #[Min(1), Max(10_000)]
        public readonly int $lines = 20,
    ) {}
}
