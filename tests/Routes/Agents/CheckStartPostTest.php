<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST agents.check-start, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'agents.check-start')]
final class CheckStartPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST agents.check-start', [
            '{agent}',
            '{session}',
            'the payload',
            'the expected commands',
        ]);
    }
}
