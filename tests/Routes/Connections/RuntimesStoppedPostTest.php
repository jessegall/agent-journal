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
 * The entry test of POST connections.runtimes.stopped, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'connections.runtimes.stopped')]
final class RuntimesStoppedPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST connections.runtimes.stopped', [
            '{binding}',
            '{runtime}',
            'the payload',
            'the expected commands',
            'the relay that signs',
        ]);
    }
}
