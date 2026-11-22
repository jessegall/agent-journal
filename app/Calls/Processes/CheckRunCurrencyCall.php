<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Attributes\Endpoint;
use App\Attributes\InPath;
use App\Contracts\JournalCall;
use App\Enums\CallEffect;
use Spatie\LaravelData\Attributes\FromRouteParameterProperty;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * Asks whether the rules a running run was admitted under still hold, under the run's event key.
 *
 * @implements JournalCall<RunCurrency>
 */
#[Endpoint('processes/runs/{processRun}/currency', 'POST', RunCurrency::class, CallEffect::Read)]
final class CheckRunCurrencyCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameterProperty('processRun', 'id')]
        public string $processRun,
        #[MapName('key')]
        public string $eventKey,
    ) {}
}
