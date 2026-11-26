<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Sessions\RecordStopConditionResults\RecordStopConditionResultsCommand;
use App\Enums\Sessions\StopCheckStatus;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports the results of the stop conditions it checked.
 */
#[TestsRoute('POST', 'agents.host.stop-attempts.results')]
final class HostStopAttemptsResultsPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $id = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters([
                'attempt' => $id,
            ])
            ->payload([
                'policy_digest' => str_repeat('a', 64),
                'workspace_generation' => 1,
                'results' => [
                    [
                        'condition_key' => 'tests',
                        'definition_hash' => str_repeat('b', 64),
                        'status' => 'passed',
                        'started_at' => '2026-11-26T10:00:00Z',
                        'ended_at' => '2026-11-26T10:01:00Z',
                        'exit_code' => 0,
                        'summary' => '',
                    ],
                ],
            ])
            ->reply(RecordStopConditionResultsCommand::class, StopCheckStatus::Passed)
            ->expects(RecordStopConditionResultsCommand::class, [
                'hostId' => $host->hostId,
                'attemptId' => $id,
                'policyDigest' => str_repeat('a', 64),
                'workspaceGeneration' => 1,
            ]);
    }
}
