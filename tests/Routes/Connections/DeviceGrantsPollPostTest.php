<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Entries\RouteEntryTestCase;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST connections.device-grants.poll, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'connections.device-grants.poll')]
final class DeviceGrantsPollPostTest extends RouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST connections.device-grants.poll', [
            'the payload',
            'the expected commands',
        ]);
    }
}
