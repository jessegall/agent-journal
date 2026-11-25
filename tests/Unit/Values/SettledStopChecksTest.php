<?php

declare(strict_types=1);

namespace Tests\Unit\Values;

use App\Values\SettledStopChecks;
use PHPUnit\Framework\TestCase;

/**
 * The settled stop checks count the run of unchanged failures before an attempt, and a different outcome ends it.
 */
final class SettledStopChecksTest extends TestCase
{
    public function test_a_different_outcome_ends_the_run(): void
    {
        $settled = new SettledStopChecks(['attempt-1' => 'same', 'attempt-2' => 'other', 'attempt-3' => 'same']);

        $this->assertSame(1, $settled->unchangedBefore('attempt-4', 'same'));
    }
}
