<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Agents\ReconcileStarts\ReconcileStartsCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host names the starts it stopped, so the journal settles them.
 */
#[TestsRoute('POST', 'agents.host.starts.reconcile')]
final class HostStartsReconcilePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload([
                'stopped' => [
                    'start-1',
                ],
            ])
            ->reply(ReconcileStartsCommand::class, 0)
            ->expects(ReconcileStartsCommand::class, [
                'hostId' => $host->hostId,
                'stoppedStartKeys' => [
                    'start-1',
                ],
            ]);
    }
}
