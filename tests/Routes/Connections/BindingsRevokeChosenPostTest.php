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
 * The entry test of POST connections.bindings.revoke-chosen, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'connections.bindings.revoke-chosen')]
final class BindingsRevokeChosenPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST connections.bindings.revoke-chosen', [
            'the payload',
            'the expected commands',
        ]);
    }
}
