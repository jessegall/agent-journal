<?php

declare(strict_types=1);

namespace Tests\Routes\Layouts;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of DELETE layouts.destroy, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('DELETE', 'layouts.destroy')]
final class DestroyDeleteTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('DELETE layouts.destroy', [
            '{layout}',
            'the payload',
            'the expected commands',
        ]);
    }
}
