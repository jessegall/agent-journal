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
 * The entry test of POST agents.start-outcome.dismiss, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'agents.start-outcome.dismiss')]
final class StartOutcomeDismissPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST agents.start-outcome.dismiss', [
            '{agent}',
            'the payload',
            'the expected commands',
        ]);
    }
}
