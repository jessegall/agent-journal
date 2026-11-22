<?php

declare(strict_types=1);

namespace App\Support\Run;

use App\Values\CommandReport;

/**
 * A run the supervisor finished, with the report printed for it so far.
 */
final readonly class SupervisedRun
{
    public function __construct(public string $runId, public CommandReport $report) {}
}
