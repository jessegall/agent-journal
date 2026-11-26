<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Projects\NotifyWorkspaceRead\NotifyWorkspaceReadCommand;
use App\Values\CommitObservation;
use App\Values\WorkspaceReadReference;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports what it found when it read a workspace.
 */
#[TestsRoute('POST', 'agents.host.workspace-reads.report')]
final class HostWorkspaceReadsReportPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters([
                'reference' => 'read-1',
            ])
            ->payload([
                'available' => true,
                'dirty' => false,
                'clean' => true,
                'generation' => 1,
            ])
            ->expects(NotifyWorkspaceReadCommand::class, [
                'hostId' => $host->hostId,
                'reference' => new WorkspaceReadReference('read-1'),
                'isAvailable' => true,
                'isDirty' => false,
                'isClean' => true,
                'generation' => 1,
                'commit' => CommitObservation::notRecorded(),
            ]);
    }
}
