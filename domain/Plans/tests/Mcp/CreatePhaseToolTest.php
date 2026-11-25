<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Mcp;

use Domain\Plans\Commands\AddPhase\AddPhaseCommand;
use Domain\Plans\Mcp\Tools\CreatePhaseTool;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent adds a phase to a plan and is given the phase.
 */
#[TestsMcpTool(CreatePhaseTool::class)]
final class CreatePhaseToolTest extends McpToolEntryTestCase
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
            ->arguments(['plan_id' => $plan->id, 'title' => 'Design', 'request_key' => 'plans-1'])
            ->reply(AddPhaseCommand::class, '01kd0000000000000000000004')
            ->expects(ExpectedCommand::of(AddPhaseCommand::class, ['planId' => $plan->id, 'title' => 'Design']));
    }
}
