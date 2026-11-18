<?php

declare(strict_types=1);

namespace App\Processes\Syntax;

use App\Processes\Enums\AnalysisLimit;

/**
 * The time one analysis may take, counted from when the budget is made.
 */
final readonly class TimeBudget
{
    private float $startedAt;

    public function __construct()
    {
        $this->startedAt = hrtime(true) / 1e6;
    }

    public function isSpent(): bool
    {
        return AnalysisLimit::Milliseconds->isPassedBy(hrtime(true) / 1e6 - $this->startedAt);
    }
}
