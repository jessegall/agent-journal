<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Mcp;

use Domain\Plans\Commands\StartPlan\StartPlanCommand;
use Domain\Plans\Mcp\Tools\StartPlanTool;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent starts an approved plan.
 */
#[TestsMcpTool(StartPlanTool::class)]
final class StartPlanToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $plan = $journal->fixtures(PlanFixtures::class)->createPlan('Release');

        return ToolCall::by($start)
            ->arguments(['plan_id' => $plan->id, 'request_key' => 'plans-1'])
            ->expects(ExpectedCommand::of(StartPlanCommand::class, ['planId' => $plan->id]));
    }
}
