<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Run;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Values\Run\AdmissionToRun;
use App\Processes\Values\Run\RunStart;

/**
 * Takes the admission the command was named.
 */
final readonly class NameAdmission implements Pipe
{
    public function handle(RunStart $start): AdmissionToRun
    {
        return $start->admission($start->admissionId);
    }
}
