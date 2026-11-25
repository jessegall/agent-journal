<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST web.renew-terminal-control, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'web.renew-terminal-control')]
final class RenewTerminalControlPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST web.renew-terminal-control', [
            '{agent}',
            'the payload',
            'the expected commands',
            'the ids of the recorded page request terminal-control-renew',
        ]);
    }
}
