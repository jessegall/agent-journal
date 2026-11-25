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
 * The entry test of POST settings.switch, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'settings.switch')]
final class SwitchPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST settings.switch', [
            'the payload',
            'the expected commands',
            'the ids of the recorded page request settings-switch',
        ]);
    }
}
