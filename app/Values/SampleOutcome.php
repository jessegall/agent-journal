<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\CommandRules\RequestStatus;

/**
 * Where a request stands after its sample run ended: awaiting proof with the run, or back to the owner's approval,
 * and the exit statuses of its contract that still lack a sample.
 */
final readonly class SampleOutcome
{
    /**
     * @param  list<int>  $unsampledStatuses
     */
    public function __construct(public RequestStatus $status, public string $runId, public array $unsampledStatuses) {}
}
