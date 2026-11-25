<?php

declare(strict_types=1);

namespace Tests\Routes\Assignments;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST assignments.auto.enable, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'assignments.auto.enable')]
final class AutoEnablePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST assignments.auto.enable', [
            'the payload',
            'the expected commands',
        ]);
    }
}
