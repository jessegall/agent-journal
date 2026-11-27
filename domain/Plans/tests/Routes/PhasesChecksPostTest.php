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
 * An agent lists the checks recorded on a phase.
 */
#[TestsRoute('POST', 'plans.phases.checks')]
final class PhasesChecksPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Planner');

        $plans = $journal->fixtures(
            PlanFixtures::class,
        )->plan('Release')->withPlan('Release', fn (TestPlan $plan) => $plan
            ->addPhase('Design'));

        $plan = $plans->planCalled('Release');
        $phase = $plans->phaseCalled('Design');

        return RouteCall::as(Caller::Agent, $start)
            ->payload(['plan' => $plan->number, 'phase' => $phase->number]);
    }
}
