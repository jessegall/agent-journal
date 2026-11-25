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
 * The entry test of POST accounts.challenge, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'accounts.challenge')]
final class ChallengePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST accounts.challenge', [
            '{attempt}',
            'the payload',
        ]);
    }
}
