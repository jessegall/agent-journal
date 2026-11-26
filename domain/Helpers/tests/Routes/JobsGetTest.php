<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Routes;

use Domain\Helpers\HelpersDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the list of helper jobs.
 */
#[TestsRoute('GET', 'helpers.jobs')]
final class JobsGetTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(HelpersDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User);
    }
}
