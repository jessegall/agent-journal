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
 * The entry test of DELETE connections.invitations.revoke, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('DELETE', 'connections.invitations.revoke')]
final class InvitationsRevokeDeleteTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('DELETE connections.invitations.revoke', [
            '{invitation}',
            'the payload',
            'the expected commands',
        ]);
    }
}
