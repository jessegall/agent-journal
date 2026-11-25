<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of PUT connections.bindings.environment, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('PUT', 'connections.bindings.environment')]
final class BindingsEnvironmentPutTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('PUT connections.bindings.environment', [
            '{binding}',
            '{environment}',
            'the payload',
            'the expected commands',
        ]);
    }
}
