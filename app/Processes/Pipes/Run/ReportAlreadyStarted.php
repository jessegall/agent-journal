<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Run;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Values\Run\FetchedAdmission;
use App\Processes\Values\Run\RunReport;

/**
 * Reports that the run started before; nothing starts again.
 */
final readonly class ReportAlreadyStarted implements Pipe
{
    public function handle(FetchedAdmission $admission): RunReport
    {
        return RunReport::ending(0)->line("Run {$admission->runId} already started; nothing was started again.");
    }
}
