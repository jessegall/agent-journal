<?php

declare(strict_types=1);

namespace App\Pipes\Run;

use App\Contracts\Bus\Pipe;
use App\Exceptions\AdmittedPlanChanged;
use App\Support\Run\FetchedAdmission;

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
