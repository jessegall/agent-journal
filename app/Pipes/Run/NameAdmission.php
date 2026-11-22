<?php

declare(strict_types=1);

namespace App\Pipes\Run;

use App\Contracts\Pipe;
use App\Support\Run\AdmissionToRun;
use App\Support\Run\RunStart;

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
