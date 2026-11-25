<?php

declare(strict_types=1);

namespace Tests\Routes\Settings;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST settings.reset, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'settings.reset')]
final class ResetPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST settings.reset', [
            'the payload',
            'the expected commands',
            'the ids of the recorded page request settings-reset',
        ]);
    }
}
