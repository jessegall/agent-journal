<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of DELETE connections.devices.revoke, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('DELETE', 'connections.devices.revoke')]
final class DevicesRevokeDeleteTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('DELETE connections.devices.revoke', [
            '{grant}',
            'the payload',
            'the expected commands',
        ]);
    }
}
