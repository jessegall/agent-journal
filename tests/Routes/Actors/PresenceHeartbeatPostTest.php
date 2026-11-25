<?php

declare(strict_types=1);

namespace Tests\Routes\Actors;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST actors.presence.heartbeat, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'actors.presence.heartbeat')]
final class PresenceHeartbeatPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST actors.presence.heartbeat', [
            'the payload',
            'the expected commands',
        ]);
    }
}
