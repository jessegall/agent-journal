<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Mcp;

use App\Enums\Assignments\AssignmentOutcomeType;
use App\Support\ActorReference;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentOutcome;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
use Domain\Plans\Commands\ReassignPlanWork\ReassignPlanWorkCommand;
use Domain\Plans\Mcp\Tools\ReassignPlanWorkTool;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A main agent moves a plan and the work under it from its holder to another agent.
 */
#[TestsMcpTool(ReassignPlanWorkTool::class)]
final class ReassignPlanWorkToolTest extends McpToolEntryTestCase
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
        $reviewer = $journal->signedStart('Reviewer');
        $root = new RecordIdentity('plans.plan', $plan->id);

        return ToolCall::by($start)
            ->arguments([
                'root' => ['type' => 'plans.plan', 'id' => $plan->id],
                'expected_assignment' => [
                    'id' => (string) Str::ulid(),
                    'holder' => ['type' => 'agent', 'id' => $holder->agent->id],
                ],
                'recipient' => ['type' => 'agent', 'id' => $reviewer->agent->id],
                'request_key' => 'plans-1',
            ])
            ->reply(ReassignPlanWorkCommand::class, new AssignmentResult(
                [new AssignmentOutcome($root, null, AssignmentOutcomeType::Changed)],
                [],
            ))
            ->expects(ReassignPlanWorkCommand::class, [
                'root' => $root,
                'recipient' => AssigneeIdentity::ofActorReference(ActorReference::of($reviewer->agent)),
            ]);
    }
}
