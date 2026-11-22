<?php

declare(strict_types=1);

namespace App\Pipes\Run;

use App\Contracts\Bus\Pipe;
use App\Support\Run\FetchedAdmission;
use App\Values\CommandReport;

/**
 * Reports that the run started before; nothing starts again.
 */
final readonly class ReportAlreadyStarted implements Pipe
{
    public function handle(FetchedAdmission $admission): CommandReport
    {
        return CommandReport::ending(0)->line("Run {$admission->runId} already started; nothing was started again.");
    }
}
