<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST profiles.sign-in-host.challenge, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'profiles.sign-in-host.challenge')]
final class SignInHostChallengePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST profiles.sign-in-host.challenge', [
            '{attempt}',
            'the payload',
            'the expected commands',
        ]);
    }
}
