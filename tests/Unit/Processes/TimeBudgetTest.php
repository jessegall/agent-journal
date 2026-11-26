<?php

declare(strict_types=1);

namespace Tests\Unit\Processes;

use App\CommandRules\Enums\AnalysisLimit;
use App\Processes\Grammar\Syntax\TimeBudget;
use PHPUnit\Framework\TestCase;

/**
 * An analysis's time counts from its first check, so the work a process does before the analysis starts, such as
 * compiling the classes of its first analysis, is never charged to the line.
 */
final class TimeBudgetTest extends TestCase
{
    public function test_processor_time_spent_before_the_first_check_is_not_charged(): void
    {
        $budget = new TimeBudget();
        $this->spendProcessorTime(AnalysisLimit::Milliseconds->value * 2);

        $this->assertFalse($budget->isSpent());
    }

    public function test_processor_time_spent_after_the_first_check_is_charged(): void
    {
        $budget = new TimeBudget();
        $budget->isSpent();
        $this->spendProcessorTime(AnalysisLimit::Milliseconds->value * 2);

        $this->assertTrue($budget->isSpent());
    }

    private function spendProcessorTime(int $milliseconds): void
    {
        $until = hrtime(true) + $milliseconds * 1_000_000;
        $spinning = 0;

        while (hrtime(true) < $until) {
            $spinning++;
        }

        $this->assertGreaterThan(0, $spinning);
    }
}
