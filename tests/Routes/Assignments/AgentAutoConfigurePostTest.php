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
 * The entry test of POST assignments.agent.auto.configure, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'assignments.agent.auto.configure')]
final class AgentAutoConfigurePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST assignments.agent.auto.configure', [
            'the payload',
            'the expected commands',
        ]);
    }
}
