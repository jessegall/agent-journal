<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\ChangeAgentEffort\ChangeAgentEffortCommand;
use App\Agents\Commands\ChangeAgentModel\ChangeAgentModelCommand;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Hosts\EnrolledHost;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Values\TurnEnd;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A setting the host staged counts as applied only on its turn's evidence: the model the output names confirms a model
 * change, while an effort change stays unconfirmed.
 */
#[TestsCommand(ChangeAgentModelCommand::class)]
final class ChangeAgentModelTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;

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
        $this->journal->claimRequestsOnHost($host->hostId, 10);

        foreach ([$model, $effort] as $setting) {
            $this->notifyTurnEnd($host, $setting->requestId, null);
        }

        $this->assertSame(RequestProgress::Staged, DriverRequest::query()->findOrFail($model->requestId)->progress);

        foreach ([$model, $effort] as $setting) {
            $this->notifyTurnEnd($host, $setting->requestId, new TurnEnd(exitCode: 0, model: 'claude-sonnet-5-5'));
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
     */
    private function notifyTurnEnd(EnrolledHost $host, string $requestId, TurnEnd|null $turnEnd): void
    {
        $request = DriverRequest::query()->findOrFail($requestId);

        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $request->id,
            $request->attempt_version,
            $turnEnd?->progress() ?? RequestProgress::Staged,
            null,
            $turnEnd?->outcome(),
            turnEnd: $turnEnd,
        ));
    }
}
