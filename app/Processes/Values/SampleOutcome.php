<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\RequestState;

/**
 * Where a request stands after its sample run ended: awaiting proof with the run, or back to the owner's approval,
 * and the exit statuses of its contract that still lack a sample.
 */
final readonly class SampleOutcome
{
    /**
     * @param  list<int>  $unsampledStatuses
     */
    public function __construct(public RequestState $state, public string $runId, public array $unsampledStatuses) {}
}
