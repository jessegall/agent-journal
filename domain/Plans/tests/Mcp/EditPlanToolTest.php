<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Mcp;

use Domain\Plans\Commands\EditPlan\EditPlanCommand;
use Domain\Plans\Mcp\Tools\EditPlanTool;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent edits a plan at the revision it read and is given the next revision.
 */
#[TestsMcpTool(EditPlanTool::class)]
final class EditPlanToolTest extends McpToolEntryTestCase
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
            ->arguments(['plan_id' => $plan->id, 'expected_revision' => 1, 'title' => 'Release six', 'request_key' => 'plans-1'])
            ->reply(EditPlanCommand::class, 2)
            ->expects(ExpectedCommand::of(EditPlanCommand::class, ['planId' => $plan->id, 'expectedRevision' => 1, 'title' => 'Release six']));
    }
}
