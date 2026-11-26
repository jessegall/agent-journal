<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Drivers\NotifyRuntimeActivity\NotifyRuntimeActivityCommand;
use App\Enums\Drivers\HoldReason;
use App\Enums\Runs\RuntimeActivity;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports what a runtime is doing.
 */
#[TestsRoute('POST', 'agents.host.reports.activity')]
final class HostReportsActivityPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload([
                'runtimeId' => 'runtime-1',
                'activity' => 'idle',
                'hold' => 'none',
                'processGeneration' => 1,
            ])
            ->expects(NotifyRuntimeActivityCommand::class, [
                'hostId' => $host->hostId,
                'runtimeId' => 'runtime-1',
                'activity' => RuntimeActivity::Idle,
                'hold' => HoldReason::None,
                'processGeneration' => 1,
            ]);
    }
}
