<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of GET profiles.switch-stage, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('GET', 'profiles.switch-stage')]
final class SwitchStageGetTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('GET profiles.switch-stage', [
            '{requestId}',
        ]);
    }
}
