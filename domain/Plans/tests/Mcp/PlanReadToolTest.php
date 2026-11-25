<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Mcp;

use Domain\Plans\Mcp\Tools\PlanReadTool;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads a plan with its phases.
 */
#[TestsMcpTool(PlanReadTool::class)]
final class PlanReadToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $plan = $journal->fixtures(PlanFixtures::class)->createPlan('Release');

        return ToolCall::by($start)->arguments(['plan_id' => $plan->id]);
    }
}
