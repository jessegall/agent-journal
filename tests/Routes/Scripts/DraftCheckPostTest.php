<?php

declare(strict_types=1);

namespace Tests\Routes\Scripts;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST scripts.draft.check, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'scripts.draft.check')]
final class DraftCheckPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST scripts.draft.check', [
            'the payload',
        ]);
    }
}
