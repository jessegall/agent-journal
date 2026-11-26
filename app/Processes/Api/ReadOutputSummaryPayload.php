<?php

declare(strict_types=1);

namespace App\Processes\Api;

use App\Attributes\Api\Endpoint;
use App\Attributes\Api\InPath;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use Spatie\LaravelData\Attributes\FromRouteParameterProperty;
use Spatie\LaravelData\Data;

/**
 * Reads a run's output summary; each read is recorded as evidence read again.
 *
 * @implements ApiPayload<OutputSummary>
 */
#[Endpoint('processes/runs/{processRun}/output/summary', 'POST', OutputSummary::class, ApiEffect::Read)]
final class ReadOutputSummaryPayload extends Data implements ApiPayload
{
    public function __construct(
        #[InPath, FromRouteParameterProperty('processRun', 'id')]
        public string $processRun,
    ) {}
}
