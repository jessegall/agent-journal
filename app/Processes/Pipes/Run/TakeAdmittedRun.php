<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Run;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Values\Run\AdmissionToRun;
use App\Processes\Values\Run\LineAdmission;

/**
 * Takes the run the journal admitted for the line.
 */
final readonly class TakeAdmittedRun implements Pipe
{
    public function handle(LineAdmission $admission): AdmissionToRun
    {
        return $admission->admission();
    }
}
