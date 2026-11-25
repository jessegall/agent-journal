<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Mcp;

use App\Enums\Assignments\AssignmentOutcomeType;
use App\Support\AssignmentOutcome;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
use Domain\Plans\Commands\UnassignPlanWork\UnassignPlanWorkCommand;
use Domain\Plans\Mcp\Tools\UnassignPlanWorkTool;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Illuminate\Support\Str;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A main agent takes a plan and the work under it back from its holder.
 */
#[TestsMcpTool(UnassignPlanWorkTool::class)]
final class UnassignPlanWorkToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $plan = $journal->fixtures(PlanFixtures::class)->createPlan('Release');
        $holder = $journal->signedStart('Builder');
        $root = new RecordIdentity('plans.plan', $plan->id);

        return ToolCall::by($start)
            ->arguments([
                'root' => [
                    'type' => 'plans.plan',
                    'id' => $plan->id,
                ],
                'expected_assignment' => [
                    'id' => (string) Str::ulid(),
                    'holder' => [
                        'type' => 'agent',
                        'id' => $holder->agent->id,
                    ],
                ],
                'request_key' => 'plans-1',
            ])
            ->reply(UnassignPlanWorkCommand::class, new AssignmentResult(
                [new AssignmentOutcome($root, null, AssignmentOutcomeType::Changed)],
                [],
            ))
            ->expects(ExpectedCommand::of(UnassignPlanWorkCommand::class, ['root' => $root]));
    }
}
