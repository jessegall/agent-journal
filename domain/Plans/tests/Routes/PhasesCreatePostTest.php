<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use Domain\Plans\Commands\AddPhase\AddPhaseCommand;
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
 * An agent adds a phase to a plan.
 */
#[TestsRoute('POST', 'plans.phases.create')]
final class PhasesCreatePostTest extends GuardedRouteEntryTestCase
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
            ->payload(['plan_id' => $plan->id, 'title' => 'Design', 'request_key' => 'plans-1'])
            ->reply(AddPhaseCommand::class, Str::ulid())
            ->expects(AddPhaseCommand::class, ['planId' => $plan->id, 'title' => 'Design']);
    }
}
