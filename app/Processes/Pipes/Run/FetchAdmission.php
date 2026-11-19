<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Run;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\Pipelines\Contracts\Pipe;
use App\Processes\Exceptions\EvidencePermitRequired;
use App\Processes\Values\Run\AdmissionToRun;
use App\Processes\Values\Run\FetchedAdmission;

/**
 * Fetches the admitted run once; a run named by nothing is refused before anything is asked.
 */
final readonly class FetchAdmission implements Pipe
{
    public function __construct(private AgentRequestSender $journal) {}

    /**
     * @throws EvidencePermitRequired
     */
    public function handle(AdmissionToRun $admission): FetchedAdmission
    {
        if (! $admission->isNamed()) {
            throw EvidencePermitRequired::forRun();
        }

        $answer = $this->journal->send("/agent/processes/admissions/{$admission->admissionId}", []);

        return FetchedAdmission::fromAnswer($answer->body, $admission->environment);
    }
}
