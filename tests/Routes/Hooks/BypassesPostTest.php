<?php

declare(strict_types=1);

namespace Tests\Routes\Hooks;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Entries\RouteEntryTestCase;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST hooks.bypasses, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'hooks.bypasses')]
final class BypassesPostTest extends RouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST hooks.bypasses', [
            'the payload',
        ]);
    }
}
