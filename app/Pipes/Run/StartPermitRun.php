<?php

declare(strict_types=1);

namespace App\Pipes\Run;

use App\Bus\Contracts\Pipe;
use App\Processes\Api\ProcessApi;
use App\Support\Run\PendingAdmission;
use App\Support\Run\RunStart;

/**
 * Starts the evidence run a permit allows, under the request id of this use.
 */
final readonly class StartPermitRun implements Pipe
{
    public function __construct(private ProcessApi $processes) {}

    public function handle(RunStart $start): PendingAdmission
    {
        $started = $this->processes->startEvidenceRun((string) $start->permit, $start->requestKey);

        return $start->admission($started->runId);
    }
}
