<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST agents.host.menu-entries.replayed, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'agents.host.menu-entries.replayed')]
final class HostMenuEntriesReplayedPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST agents.host.menu-entries.replayed', [
            '{entry}',
            'the payload',
            'the expected commands',
        ]);
    }
}
