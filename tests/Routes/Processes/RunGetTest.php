<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of GET processes.run, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('GET', 'processes.run')]
final class RunGetTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('GET processes.run', [
            '{run}',
        ]);
    }
}
