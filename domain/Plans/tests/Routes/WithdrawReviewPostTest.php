<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use Domain\Plans\Commands\WithdrawPlanReview\WithdrawPlanReviewCommand;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner withdraws the review of a plan.
 */
#[TestsRoute('POST', 'plans.withdraw-review')]
final class WithdrawReviewPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $plan = $journal->owner()->fixtures(PlanFixtures::class)->createPlan('Release');

        return RouteCall::as(Caller::User)
            ->parameters(['plan' => $plan->number])
            ->headers(['Idempotency-Key' => 'review-1'])
            ->expects(WithdrawPlanReviewCommand::class, ['planId' => $plan->id]);
    }
}
