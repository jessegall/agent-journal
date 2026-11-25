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
 * The entry test of POST processes.agent.rules.retire, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'processes.agent.rules.retire')]
final class AgentRulesRetirePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST processes.agent.rules.retire', [
            '{rule}',
            'the payload',
            'the expected commands',
        ]);
    }
}
