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
 * The entry test of POST agents.host.starts.failure, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'agents.host.starts.failure')]
final class HostStartsFailurePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST agents.host.starts.failure', [
            '{start}',
            'the payload',
            'the expected commands',
        ]);
    }
}
