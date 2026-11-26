<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Drivers\NotifyDriverTurn\NotifyDriverTurnCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports a driver turn of a runtime.
 */
#[TestsRoute('POST', 'agents.host.reports.turn')]
final class HostReportsTurnPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload([
                'runtimeId' => 'runtime-1',
                'processGeneration' => 1,
                'nativePromptId' => 'prompt-1',
                'hasFinished' => true,
                'model' => 'claude-opus-5-5',
                'effort' => null,
                'outcome' => null,
            ])
            ->expects(NotifyDriverTurnCommand::class, [
                'hostId' => $host->hostId,
                'runtimeId' => 'runtime-1',
                'processGeneration' => 1,
                'nativePromptId' => 'prompt-1',
                'hasFinished' => true,
            ]);
    }
}
