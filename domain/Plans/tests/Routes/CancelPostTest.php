<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use Domain\Plans\Commands\CancelPlan\CancelPlanCommand;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent cancels a plan at the revision it read, with a reason.
 */
#[TestsRoute('POST', 'plans.cancel')]
final class CancelPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $plan = $journal->fixtures(PlanFixtures::class)->createPlan('Release');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'plan_id' => $plan->id,
                'expected_revision' => 1,
                'reason' => 'Not needed.',
                'request_key' => 'plans-1',
            ])
            ->expects(CancelPlanCommand::class, [
                'planId' => $plan->id,
                'expectedRevision' => 1,
                'reason' => 'Not needed.',
            ]);
    }
}
