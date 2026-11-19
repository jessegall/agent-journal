<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Run;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Calls\ProcessCalls;
use App\Processes\Enums\ShellDialect;
use App\Processes\Values\Run\AdmissionToRun;
use App\Processes\Values\Run\RunStart;

/**
 * Asks the journal to admit the line through the one shell admission; a refusal stops the run before anything starts.
 */
final readonly class AdmitLine implements Pipe
{
    public function __construct(private ProcessCalls $processes) {}

    public function handle(RunStart $start): AdmissionToRun
    {
        $admitted = $this->processes->admitLine(
            (string) $start->line,
            ShellDialect::from($start->dialect),
            $start->workingFolder,
            $start->requestKey,
        );

        return $start->admission($admitted->runId);
    }
}
