<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Mcp;

use Domain\Plans\Commands\FinishPlan\FinishPlanCommand;
use Domain\Plans\Mcp\Tools\FinishPlanTool;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent finishes a plan at the revision it read, with a closing note.
 */
#[TestsMcpTool(FinishPlanTool::class)]
final class FinishPlanToolTest extends McpToolEntryTestCase
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
            ->arguments([
                'plan_id' => $plan->id,
                'expected_revision' => 1,
                'note' => 'Shipped.',
                'request_key' => 'plans-1',
            ])
            ->expects(FinishPlanCommand::class, ['planId' => $plan->id, 'expectedRevision' => 1, 'note' => 'Shipped.']);
    }
}
