<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Run;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Values\Run\LineAdmission;
use App\Processes\Values\Run\RunReport;

/**
 * Reports why the journal refused the line and what to do instead; nothing starts.
 */
final readonly class ReportRefusedLine implements Pipe
{
    public function handle(LineAdmission $admission): RunReport
    {
        return $admission->refusalReport();
    }
}
