<?php

declare(strict_types=1);

namespace App\Processes\Api;

use App\Attributes\Api\Endpoint;
use App\Attributes\Api\InPath;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use Spatie\LaravelData\Attributes\FromRouteParameterProperty;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * Asks whether the rules a running run was admitted under still hold, under the run's event key.
 *
 * @implements ApiPayload<RunStaleness>
 */
#[Endpoint('processes/runs/{processRun}/staleness', 'POST', RunStaleness::class, ApiEffect::Read)]
final class CheckRunStalenessPayload extends Data implements ApiPayload
{
    public function __construct(
        #[InPath, FromRouteParameterProperty('processRun', 'id')]
        public string $processRun,
        #[MapName('key')]
        public string $eventKey,
    ) {}
}
