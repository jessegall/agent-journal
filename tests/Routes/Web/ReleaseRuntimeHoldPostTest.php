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
 * The entry test of POST web.release-runtime-hold, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'web.release-runtime-hold')]
final class ReleaseRuntimeHoldPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST web.release-runtime-hold', [
            '{session}',
            'the payload',
            'the expected commands',
        ]);
    }
}
