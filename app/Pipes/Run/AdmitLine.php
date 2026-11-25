<?php

declare(strict_types=1);

namespace App\Pipes\Run;

use App\Api\Processes\ProcessApi;
use App\Contracts\Bus\Pipe;
use App\Enums\Processes\ShellDialect;
use App\Support\Run\PendingAdmission;
use App\Support\Run\RunStart;

/**
 * Asks the journal to admit the line through the one shell admission; a refusal stops the run before anything starts.
 */
final readonly class AdmitLine implements Pipe
{
    public function __construct(private ProcessApi $processes) {}

    public function handle(RunStart $start): PendingAdmission
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
