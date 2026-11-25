<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\ChangeAgentEffort\ChangeAgentEffortCommand;
use App\Commands\Agents\ChangeAgentModel\ChangeAgentModelCommand;
use App\Commands\Drivers\ClaimDriverRequests\ClaimDriverRequestsCommand;
use App\Enums\Drivers\RequestProgress;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Support\EnrolledHost;
use App\Values\BrowserInputCapabilities;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensPairChats;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * A setting the host staged counts as applied only on its turn's evidence: the model the output names confirms a model
 * change, while an effort change stays unconfirmed.
 */
final class ChangeAgentModelTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;
    use OpensPairChats;
    use WritesInboxMessages;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'links',
    ];

    /**
     * A setting change the host staged waits for a turn and counts as applied only on that turn's evidence: the model
     * its output names confirms a model change, while an effort change, which no output shows, stays unconfirmed.
     */
    public function test_a_staged_setting_is_applied_only_on_the_turns_evidence(): void
    {
        [$host, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $model = $this->asOwner(
            new ChangeAgentModelCommand($agentId, $opened->sessionId, 'model-1', 'claude-sonnet-5-5'),
        );
        $effort = $this->asOwner(new ChangeAgentEffortCommand($agentId, $opened->sessionId, 'effort-1', 'high'));
        $this->journal->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        foreach ([$model, $effort] as $setting) {
            $this->notifyTurnEnd($host, $setting->requestId, null);
        }

        $this->assertSame(RequestProgress::Staged, DriverRequest::query()->findOrFail($model->requestId)->progress);

        foreach ([$model, $effort] as $setting) {
            $this->notifyTurnEnd($host, $setting->requestId, ['exit_code' => 0, 'model' => 'claude-sonnet-5-5']);
        }

        $this->assertSame(
            [RequestProgress::Applied, RequestProgress::DeliveryUncertain],
            [
                DriverRequest::query()->findOrFail($model->requestId)->progress,
                DriverRequest::query()->findOrFail($effort->requestId)->progress,
            ],
        );
    }

    /**
     * The host's report of a request: staged without a turn's end, or the turn's end as the host saw it.
     *
     * @param  array<string, int|string|bool>|null  $turnEnd
     */
    private function notifyTurnEnd(EnrolledHost $host, string $requestId, array|null $turnEnd): void
    {
        $request = DriverRequest::query()->findOrFail($requestId);
        $report = ['request_id' => $request->id, 'attempt' => $request->attempt_version, 'actual_binding' => null];

        $this->journal->hostCall(
            $host,
            'POST',
            '/host/reports/request',
            $turnEnd === null ? [...$report, 'progress' => 'staged'] : [...$report, 'turn_end' => $turnEnd],
        )->assertSuccessful();
    }
}
