<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Projects\Commands\NotifyProjectRead\NotifyProjectReadCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports the folder entries a project read found.
 */
#[TestsRoute('POST', 'agents.host.reports.project-reads')]
final class HostReportsProjectReadsPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $id = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters([
                'read' => $id,
            ])
            ->payload([
                'entries' => [
                    [
                        'name' => 'src',
                        'is_folder' => true,
                        'size' => 0,
                    ],
                ],
            ])
            ->expects(NotifyProjectReadCommand::class, [
                'hostId' => $host->hostId,
                'readId' => $id,
            ]);
    }
}
