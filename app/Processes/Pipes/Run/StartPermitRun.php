<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Run;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\Pipelines\Contracts\Pipe;
use App\Processes\Values\Run\AdmissionToRun;
use App\Processes\Values\Run\RunStart;

/**
 * Starts the evidence run a permit allows, under the request id of this use.
 */
final readonly class StartPermitRun implements Pipe
{
    public function __construct(private AgentRequestSender $journal) {}

    public function handle(RunStart $start): AdmissionToRun
    {
        $started = $this->journal->send("/agent/processes/permits/{$start->permit}/runs", [
            'request_id' => $start->requestId,
        ]);

        return $start->admission((string) $started->body['run_id']);
    }
}
