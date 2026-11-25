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
 * The entry test of DELETE connections.bindings.revoke, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('DELETE', 'connections.bindings.revoke')]
final class BindingsRevokeDeleteTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('DELETE connections.bindings.revoke', [
            '{binding}',
            'the payload',
            'the expected commands',
        ]);
    }
}
