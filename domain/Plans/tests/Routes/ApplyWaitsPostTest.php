<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use Domain\Plans\PlansDomain;
use Domain\Plans\Support\PlanGraphService;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Tasks\Commands\ApplyTaskWaits\ApplyTaskWaitsCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner applies the suggested waits between a plan's tasks.
 */
#[TestsRoute('POST', 'plans.apply-waits')]
final class ApplyWaitsPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $plan = $journal->owner()->fixtures(PlanFixtures::class)->createPlan('Release');
        $journal->service(PlanGraphService::class)->suggest($plan);

        return RouteCall::as(Caller::User)
            ->parameters([
                'plan' => $plan->number,
            ])
            ->reply(ApplyTaskWaitsCommand::class, 'graph-2')
            ->expects(ApplyTaskWaitsCommand::class);
    }
}
