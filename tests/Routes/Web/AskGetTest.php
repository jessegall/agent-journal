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
 * The entry test of GET web.ask, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('GET', 'web.ask')]
final class AskGetTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('GET web.ask', [
            '{ask}',
        ]);
    }
}
