<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use App\Enums\Assignments\AssignmentOutcomeType;
use App\Support\AssignmentOutcome;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
use Domain\Plans\Commands\UnassignPlanWork\UnassignPlanWorkCommand;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent takes the work of a plan off the agent holding it.
 */
#[TestsRoute('POST', 'plans.work.unassign')]
final class WorkUnassignPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $plan = $journal->fixtures(PlanFixtures::class)->createPlan('Release');
        $holder = $journal->signedStart('Builder');
        $root = new RecordIdentity('plans.plan', $plan->id);

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'root_type' => 'plans.plan',
                'root_id' => $plan->id,
                'assignment_id' => strtolower((string) Str::ulid()),
                'holder_type' => 'agent',
                'holder_id' => $holder->agent->id,
                'request_key' => 'plans-1',
            ])
            ->reply(UnassignPlanWorkCommand::class, new AssignmentResult(
                [new AssignmentOutcome($root, null, AssignmentOutcomeType::Changed)],
                [],
            ))
            ->expects(UnassignPlanWorkCommand::class, [
                'root' => $root,
            ]);
    }
}
