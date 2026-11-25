<?php

declare(strict_types=1);

namespace App\Support\Syntax;

use App\Enums\CommandRules\AnalysisLimit;
use App\Exceptions\ProcessorTimeUnreadable;

/**
 * The time one analysis may take, in the processor time this process spends, so a line costs the same whether or not
 * the machine is busy with other work. It counts from its first check, once the analysis is under way, so the classes
 * a process compiles for its first analysis are never charged to that line.
 */
final class TimeBudget
{
    private float|null $startedAt = null;

    public function isSpent(): bool
    {
        $now = self::processorMilliseconds();
        $this->startedAt ??= $now;

        return AnalysisLimit::Milliseconds->isPassedBy($now - $this->startedAt);
    }

    /**
     * The processor time this process has spent so far, in user and system mode, in milliseconds.
     *
     * @throws ProcessorTimeUnreadable
     */
    private static function processorMilliseconds(): float
    {
        $usage = getrusage() ?: throw ProcessorTimeUnreadable::forThisProcess();

        return ($usage['ru_utime.tv_sec'] + $usage['ru_stime.tv_sec']) * 1_000
            + ($usage['ru_utime.tv_usec'] + $usage['ru_stime.tv_usec']) / 1_000;
    }
}
