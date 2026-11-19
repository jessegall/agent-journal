<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Run;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Calls\ProcessCalls;
use App\Processes\Values\Run\AdmissionToRun;
use App\Processes\Values\Run\RunStart;

/**
 * Starts the evidence run a permit allows, under the request id of this use.
 */
final readonly class StartPermitRun implements Pipe
{
    public function __construct(private ProcessCalls $processes) {}

    public function handle(RunStart $start): AdmissionToRun
    {
        $started = $this->processes->startEvidenceRun((string) $start->permit, $start->requestKey);

        return $start->admission($started->runId);
    }
}
