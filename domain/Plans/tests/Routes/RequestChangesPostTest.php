<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use Domain\Plans\Commands\RequestPlanChanges\RequestPlanChangesCommand;
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
 * The owner asks for changes to an edition of a plan under review.
 */
#[TestsRoute('POST', 'plans.request-changes')]
final class RequestChangesPostTest extends GuardedRouteEntryTestCase
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
            ->headers([
                'Idempotency-Key' => 'review-1',
            ])
            ->payload([
                'edition' => 1,
                'reason' => 'Split the second phase.',
            ])
            ->reply(RequestPlanChangesCommand::class, Str::ulid())
            ->expects(RequestPlanChangesCommand::class, [
                'planId' => $plan->id,
                'editionNumber' => 1,
                'requestKey' => 'review-1',
                'reason' => 'Split the second phase.',
            ]);
    }
}
