<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\Fixtures\TestPlan;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens a phase of a plan.
 */
#[TestsRoute('GET', 'plans.phase')]
final class PhaseGetTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $plans = $journal->owner()->fixtures(PlanFixtures::class)->plan('Release')->withPlan('Release', fn (TestPlan $plan) => $plan
            ->addPhase('Design'));

        return RouteCall::as(Caller::User)
            ->parameters([
                'plan' => $plans->planCalled('Release')->number,
                'phase' => $plans->phaseCalled('Design')->number,
            ]);
    }
}
