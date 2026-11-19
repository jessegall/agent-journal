<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Run;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Exceptions\AdmittedPlanChanged;
use App\Processes\Values\Run\FetchedAdmission;

/**
 * Refuses a plan that does not match the tree the journal admitted.
 */
final readonly class CheckPlanDigest implements Pipe
{
    /**
     * @throws AdmittedPlanChanged
     */
    public function handle(FetchedAdmission $admission): FetchedAdmission
    {
        if (! $admission->planMatches()) {
            throw AdmittedPlanChanged::forRun($admission->runId);
        }

        return $admission;
    }
}
