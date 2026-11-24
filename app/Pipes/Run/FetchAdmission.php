<?php

declare(strict_types=1);

namespace App\Pipes\Run;

use App\Calls\Processes\ProcessCalls;
use App\Contracts\Bus\Pipe;
use App\Exceptions\EvidencePermitRequired;
use App\Support\Run\FetchedAdmission;
use App\Support\Run\PendingAdmission;

/**
 * Fetches the admitted run once; a run named by nothing is refused before anything is asked.
 */
final readonly class FetchAdmission implements Pipe
{
    public function __construct(private ProcessCalls $processes) {}

    /**
     * @throws EvidencePermitRequired
     */
    public function handle(PendingAdmission $admission): FetchedAdmission
    {
        if (! $admission->isNamed()) {
            throw EvidencePermitRequired::forRun();
        }

        $answer = $this->processes->fetchAdmission($admission->admissionId, $admission->requestKey);

        return FetchedAdmission::fromAnswer($answer, $admission->environment);
    }
}
