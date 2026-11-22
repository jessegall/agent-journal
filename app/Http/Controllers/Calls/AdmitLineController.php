<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\AdmitLineCall;
use App\Calls\Processes\LineAdmitted;
use App\Contracts\ShellAdmission;
use App\Exceptions\LineRefused;
use App\Values\AdmissionRefusal;
use App\Values\ExecutionContext;

/**
 * Admits one line through the shell admission and answers the run it admitted, or refuses with why and what to do.
 */
final readonly class AdmitLineController
{
    /**
     * @throws LineRefused
     */
    public function __invoke(AdmitLineCall $call, ShellAdmission $admissions): LineAdmitted
    {
        $context = new ExecutionContext($call->dialect, $call->workingFolder, $call->workingFolder);
        $admission = $admissions->admit($call->line, $call->dialect, $context, $call->requestKey->value);

        if ($admission->decision instanceof AdmissionRefusal) {
            throw LineRefused::for($admission->decision);
        }

        return LineAdmitted::from(['runId' => (string) $admission->runId]);
    }
}
