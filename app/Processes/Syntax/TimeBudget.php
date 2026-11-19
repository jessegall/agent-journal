<?php

declare(strict_types=1);

namespace App\Processes\Syntax;

use App\Processes\Enums\AnalysisLimit;
use App\Processes\Exceptions\ProcessorTimeUnreadable;

/**
 * The time one analysis may take, counted from when the budget is made in the processor time this process spends,
 * so a line costs the same whether or not the machine is busy with other work.
 */
final readonly class TimeBudget
{
    private float $startedAt;

    public function __construct()
    {
        $this->startedAt = self::processorMilliseconds();
    }

    public function isSpent(): bool
    {
        return AnalysisLimit::Milliseconds->isPassedBy(self::processorMilliseconds() - $this->startedAt);
    }

    /**
     * The processor time this process has spent so far, in user and system mode, in milliseconds.
     *
     * @throws ProcessorTimeUnreadable
     */
    private static function processorMilliseconds(): float
    {
        $usage = getrusage() ?: throw ProcessorTimeUnreadable::now();

        return ($usage['ru_utime.tv_sec'] + $usage['ru_stime.tv_sec']) * 1_000
            + ($usage['ru_utime.tv_usec'] + $usage['ru_stime.tv_usec']) / 1_000;
    }
}
