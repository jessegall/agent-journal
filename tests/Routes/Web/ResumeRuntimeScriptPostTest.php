<?php

declare(strict_types=1);

namespace Tests\Routes\Web;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST web.resume-runtime-script, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'web.resume-runtime-script')]
final class ResumeRuntimeScriptPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST web.resume-runtime-script', [
            '{driver_request}',
            'the payload',
            'the expected commands',
        ]);
    }
}
