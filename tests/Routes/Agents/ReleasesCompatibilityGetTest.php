<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Entries\RouteEntryTestCase;
use Tests\Support\Seeding\TestJournal;

/**
 * Anyone reads which releases the journal works with: nothing is sent on.
 */
#[TestsRoute('GET', 'agents.releases.compatibility')]
final class ReleasesCompatibilityGetTest extends RouteEntryTestCase
{
    use ConnectsProjects;

    protected function arrange(TestJournal $journal): RouteCall
    {
        return RouteCall::as(Caller::Public);
    }
}
