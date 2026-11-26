<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use App\Enums\Assignments\AssignmentOutcomeType;
use App\Support\ActorReference;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentOutcome;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
use Domain\Plans\Commands\AssignPlanWork\AssignPlanWorkCommand;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent assigns the work of a plan to another agent.
 */
#[TestsRoute('POST', 'plans.work.assign')]
final class WorkAssignPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $plan = $journal->fixtures(PlanFixtures::class)->createPlan('Release');
        $builder = $journal->signedStart('Builder');
        $root = new RecordIdentity('plans.plan', $plan->id);

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'root_type' => 'plans.plan',
                'root_id' => $plan->id,
                'recipient_type' => 'agent',
                'recipient_id' => $builder->agent->id,
                'request_key' => 'plans-1',
            ])
            ->reply(AssignPlanWorkCommand::class, new AssignmentResult(
                [new AssignmentOutcome($root, null, AssignmentOutcomeType::Changed)],
                [],
            ))
            ->expects(AssignPlanWorkCommand::class, [
                'root' => $root,
                'recipient' => AssigneeIdentity::ofActorReference(ActorReference::of($builder->agent)),
            ]);
    }
}
