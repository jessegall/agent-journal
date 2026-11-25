<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Entries\RouteEntryTestCase;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of GET agents.releases.artifact, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('GET', 'agents.releases.artifact')]
final class ReleasesArtifactGetTest extends RouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('GET agents.releases.artifact', [
            '{version}',
            '{target}',
            '{name}',
        ]);
    }
}
