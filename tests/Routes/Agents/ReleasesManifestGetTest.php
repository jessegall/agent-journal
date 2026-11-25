<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Entries\RouteEntryTestCase;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of GET agents.releases.manifest, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('GET', 'agents.releases.manifest')]
final class ReleasesManifestGetTest extends RouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        return RouteCall::as(Caller::Public);
    }
}
