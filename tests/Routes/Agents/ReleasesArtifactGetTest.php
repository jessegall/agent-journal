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
 * Anyone downloads a file of a published release for their platform: nothing is sent on.
 */
#[TestsRoute('GET', 'agents.releases.artifact')]
final class ReleasesArtifactGetTest extends RouteEntryTestCase
{
    use ConnectsProjects;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $folder = (string) config('journal.files.places.releases');
        mkdir("{$folder}/1.0.0/darwin-arm64/bin", 0755, true);
        file_put_contents("{$folder}/1.0.0/darwin-arm64/bin/journal-agent", 'binary');

        return RouteCall::as(Caller::Public)->parameters([
            'version' => '1.0.0',
            'target' => 'darwin-arm64',
            'name' => 'bin/journal-agent',
        ]);
    }
}
