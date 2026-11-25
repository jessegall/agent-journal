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
 * The entry test of POST profiles.start-main, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'profiles.start-main')]
final class StartMainPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST profiles.start-main', [
            '{profile}',
            'the payload',
            'the expected commands',
            'the ids of the recorded page request session-start',
        ]);
    }
}
