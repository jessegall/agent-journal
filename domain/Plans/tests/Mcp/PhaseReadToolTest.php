<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Mcp;

use Domain\Plans\Mcp\Tools\PhaseReadTool;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A main agent reads one phase of a plan with its tasks.
 */
#[TestsMcpTool(PhaseReadTool::class)]
final class PhaseReadToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $phase = $journal->fixtures(PlanFixtures::class)->plan('Release')->phase('Release', 'Design')->phaseCalled('Design');

        return ToolCall::by($start)->arguments(['phase_id' => $phase->id]);
    }
}
