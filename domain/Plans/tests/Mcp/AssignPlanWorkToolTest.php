<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Mcp;

use App\Enums\Assignments\AssignmentOutcomeType;
use App\Support\ActorReference;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentOutcome;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
use Domain\Plans\Commands\AssignPlanWork\AssignPlanWorkCommand;
use Domain\Plans\Mcp\Tools\AssignPlanWorkTool;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A main agent assigns a plan and the work under it to an agent.
 */
#[TestsMcpTool(AssignPlanWorkTool::class)]
final class AssignPlanWorkToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $plan = $journal->fixtures(PlanFixtures::class)->createPlan('Release');
        $builder = $journal->signedStart('Builder');
        $root = new RecordIdentity('plans.plan', $plan->id);

        return ToolCall::by($start)
            ->arguments([
                'root' => [
                    'type' => 'plans.plan',
                    'id' => $plan->id,
                ],
                'recipient' => [
                    'type' => 'agent',
                    'id' => $builder->agent->id,
                ],
                'request_key' => 'plans-1',
            ])
            ->reply(AssignPlanWorkCommand::class, new AssignmentResult(
                [new AssignmentOutcome($root, null, AssignmentOutcomeType::Changed)],
                [],
            ))
            ->expects(ExpectedCommand::of(AssignPlanWorkCommand::class, [
                'root' => $root,
                'recipient' => AssigneeIdentity::ofActorReference(ActorReference::of($builder->agent)),
            ]));
    }
}
