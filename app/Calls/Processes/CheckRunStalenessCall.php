<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Attributes\Api\Endpoint;
use App\Attributes\Api\InPath;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use Spatie\LaravelData\Attributes\FromRouteParameterProperty;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * Asks whether the rules a running run was admitted under still hold, under the run's event key.
 *
 * @implements JournalCall<RunStaleness>
 */
#[Endpoint('processes/runs/{processRun}/staleness', 'POST', RunStaleness::class, CallEffect::Read)]
final class CheckRunStalenessCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameterProperty('processRun', 'id')]
        public string $processRun,
        #[MapName('key')]
        public string $eventKey,
    ) {}
}
