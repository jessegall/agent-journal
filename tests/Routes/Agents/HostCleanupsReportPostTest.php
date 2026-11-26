<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Sessions\NotifyCleanup\NotifyCleanupCommand;
use App\Enums\Sessions\CleanupStatus;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports what it removed while cleaning up a session.
 */
#[TestsRoute('POST', 'agents.host.cleanups.report')]
final class HostCleanupsReportPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $id = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters([
                'session' => $id,
            ])
            ->payload([
                'removed' => [
                    'container',
                ],
            ])
            ->reply(NotifyCleanupCommand::class, CleanupStatus::Done)
            ->expects(NotifyCleanupCommand::class, [
                'hostId' => $host->hostId,
                'sessionId' => $id,
            ]);
    }
}
