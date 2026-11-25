<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Enums\Runs\RunLogicalResult;
use Tests\TestCase;

/**
 * A run attempt keeps one logical result: the root status decides it, a lost attempt is provisionally unknown until
 * a signed result corrects it in place, and a second signed result that disagrees is refused and kept.
 */
final class RunOutcomeTest extends TestCase
{
    public function test_the_root_status_decides_the_result_whatever_a_part_did(): void
    {
        $this->assertSame(RunLogicalResult::Succeeded, RunLogicalResult::ofRootStatus(0));
        $this->assertSame(RunLogicalResult::Failed, RunLogicalResult::ofRootStatus(2));
    }
}
