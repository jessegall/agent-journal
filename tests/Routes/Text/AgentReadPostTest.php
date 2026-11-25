<?php

declare(strict_types=1);

namespace Tests\Routes\Text;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST text.agent.read, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'text.agent.read')]
final class AgentReadPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST text.agent.read', [
            'the payload',
        ]);
    }
}
