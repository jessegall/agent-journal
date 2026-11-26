<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Routes;

use Domain\Helpers\HelpersDomain;
use Domain\Helpers\Tests\Fixtures\HelperFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads the newest notices of its helpers.
 */
#[TestsRoute('POST', 'helpers.notices')]
final class NoticesPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(HelpersDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $journal->fixtures(HelperFixtures::class)->openJob('Review', 'Planner', 'Review the change.');

        return RouteCall::as(Caller::Agent, $start);
    }
}
