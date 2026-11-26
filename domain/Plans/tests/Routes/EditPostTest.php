<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use Domain\Plans\Commands\EditPlan\EditPlanCommand;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent changes a plan's title at the revision it read.
 */
#[TestsRoute('POST', 'plans.edit')]
final class EditPostTest extends GuardedRouteEntryTestCase
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
                'title' => 'Release six',
                'brief' => null,
                'type' => null,
                'request_key' => 'plans-1',
            ])
            ->reply(EditPlanCommand::class, 2)
            ->expects(EditPlanCommand::class, [
                'planId' => $plan->id,
                'expectedRevision' => 1,
                'title' => 'Release six',
            ]);
    }
}
