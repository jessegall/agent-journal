<?php

declare(strict_types=1);

namespace App\Processes\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Attributes\InPath;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use Spatie\LaravelData\Attributes\FromRouteParameterProperty;
use Spatie\LaravelData\Data;

/**
 * Reads a run's output summary; each read is recorded as evidence read again.
 *
 * @implements JournalCall<OutputSummary>
 */
#[Endpoint('processes/runs/{processRun}/output/summary', 'POST', OutputSummary::class, CallEffect::Read)]
final class ReadOutputSummaryCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameterProperty('processRun', 'id')]
        public string $processRun,
    ) {}
}
