<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Entries\RouteEntryTestCase;
use Tests\Support\Seeding\TestJournal;

/**
 * Anyone reads the signature of the current release's manifest: nothing is sent on.
 */
#[TestsRoute('GET', 'agents.releases.signature')]
final class ReleasesSignatureGetTest extends RouteEntryTestCase
{
    use ConnectsProjects;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $folder = (string) config('journal.files.places.releases');
        file_put_contents("{$folder}/1.0.0/manifest.json.sig", 'signature');

        return RouteCall::as(Caller::Public);
    }
}
