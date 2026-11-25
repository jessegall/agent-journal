<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of PATCH accounts.rename, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('PATCH', 'accounts.rename')]
final class RenamePatchTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('PATCH accounts.rename', [
            '{account}',
            'the payload',
            'the expected commands',
            'the ids of the recorded page request account-rename',
        ]);
    }
}
