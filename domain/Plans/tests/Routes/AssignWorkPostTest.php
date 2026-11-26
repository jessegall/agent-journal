<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use App\Enums\Assignments\AssignmentOutcomeType;
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
 * The owner assigns the work of a plan to an agent.
 */
#[TestsRoute('POST', 'plans.assign-work')]
final class AssignWorkPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $plan = $journal->owner()->fixtures(PlanFixtures::class)->createPlan('Release');
        $builder = $journal->signedStart('Builder');
        $journal->actAs('Owner');
        $root = new RecordIdentity('plans.plan', $plan->id);

        return RouteCall::as(Caller::User)
            ->parameters([
                'plan' => $plan->number,
            ])
            ->payload([
                'recipient_type' => 'agent',
                'recipient_id' => $builder->agent->id,
            ])
            ->reply(AssignPlanWorkCommand::class, new AssignmentResult(
                [new AssignmentOutcome($root, null, AssignmentOutcomeType::Changed)],
                [],
            ))
            ->expects(AssignPlanWorkCommand::class, [
                'root' => $root,
                'recipient' => new AssigneeIdentity('agent', $builder->agent->id),
            ]);
    }
}
