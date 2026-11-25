<?php

declare(strict_types=1);

namespace Tests\Routes\Links;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST links.agent.remove, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'links.agent.remove')]
final class AgentRemovePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST links.agent.remove', [
            'the payload',
            'the expected commands',
        ]);
    }
}
