<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Run;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\Pipelines\Contracts\Pipe;
use App\Processes\Values\Run\LineAdmission;
use App\Processes\Values\Run\RunStart;

/**
 * Asks the journal to admit the line through the one shell admission.
 */
final readonly class AdmitLine implements Pipe
{
    public function __construct(private AgentRequestSender $journal) {}

    public function handle(RunStart $start): LineAdmission
    {
        $answer = $this->journal->send('/agent/processes/admit', [
            'line' => (string) $start->line,
            'dialect' => $start->dialect,
            'working_folder' => $start->workingFolder,
            'request_id' => $start->requestId,
        ]);

        return LineAdmission::fromAnswer($answer->body, $start->environment);
    }
}
