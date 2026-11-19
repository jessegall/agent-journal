<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Run;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Calls\ProcessCalls;
use App\Processes\Exceptions\EvidencePermitRequired;
use App\Processes\Values\Run\AdmissionToRun;
use App\Processes\Values\Run\FetchedAdmission;

/**
 * Fetches the admitted run once; a run named by nothing is refused before anything is asked.
 */
final readonly class FetchAdmission implements Pipe
{
    public function __construct(private ProcessCalls $processes) {}

    /**
     * @throws EvidencePermitRequired
     */
    public function handle(AdmissionToRun $admission): FetchedAdmission
    {
        if (! $admission->isNamed()) {
            throw EvidencePermitRequired::forRun();
        }

        $answer = $this->processes->fetchAdmission($admission->admissionId, $admission->requestKey);

        return FetchedAdmission::fromAnswer($answer, $admission->environment);
    }
}
