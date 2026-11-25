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
 * The entry test of POST accounts.sign-in-again, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'accounts.sign-in-again')]
final class SignInAgainPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST accounts.sign-in-again', [
            '{account}',
            'the payload',
            'the expected commands',
            'the ids of the recorded page request account-sign-in-again',
        ]);
    }
}
