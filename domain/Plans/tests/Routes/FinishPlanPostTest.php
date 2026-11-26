<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use Domain\Plans\Commands\FinishPlan\FinishPlanCommand;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner finishes a plan at the revision and state they saw, with a note.
 */
#[TestsRoute('POST', 'plans.finish-plan')]
final class FinishPlanPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $plan = $journal->owner()->fixtures(PlanFixtures::class)->createPlan('Release');

        return RouteCall::as(Caller::User)
            ->parameters([
                'plan' => $plan->number,
            ])
            ->payload([
                'revision' => 1,
                'state' => 'planned',
                'text' => 'Shipped.',
            ])
            ->expects(FinishPlanCommand::class, [
                'planId' => $plan->id,
                'expectedRevision' => 1,
                'note' => 'Shipped.',
            ]);
    }
}
