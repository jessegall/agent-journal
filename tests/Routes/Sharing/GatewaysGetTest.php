<?php

declare(strict_types=1);

namespace Tests\Routes\Sharing;

use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the share gateway settings.
 */
#[TestsRoute('GET', 'sharing.gateways')]
final class GatewaysGetTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User);
    }
}
