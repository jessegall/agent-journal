<?php

declare(strict_types=1);

namespace Tests\States;

use App\Agents\Commands\ChangeAgentModel\ChangeAgentModelCommand;
use App\Agents\Commands\RepairDriverSettings\RepairDriverSettingsCommand;
use App\Agents\Drivers\Commands\CancelDriverRequest\CancelDriverRequestCommand;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Enums\RequestOutcome;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Hosts\EnrolledHost;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentStackRow;
use App\Models\Drivers\DriverRequest;
use App\Sessions\OpenedRuntime;
use App\Sessions\States\ChangeModelState;
use App\Sessions\States\Support\ChangeModelStateReference;
use App\Stacks\Decisions\StateReferenceKeys;
use App\Support\Storage\FrameRecord;
use App\Values\StackTarget;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\TestCase;

/**
 * A model change is owned by its state from the moment it is accepted: the state holds the model and its request,
 * takes a repaired model in its place, records the model on the runtime once the driver applied the request, and ends
 * with nothing recorded when the request is cancelled.
 */
#[TestsState(ChangeModelState::class)]
final class ChangeModelStateTest extends TestCase
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

    public function test_an_accepted_change_puts_the_state_holding_its_model_on_the_sessions_stack(): void
    {
        [, $opened] = $this->openRuntime();
        $change = $this->change($opened, 'claude-opus-5-5');

        $frame = $this->changeFrameOf($opened);
        $this->assertSame(
            [$change->requestId, 'claude-opus-5-5', false],
            [$frame->values['requestId'], $frame->values['model'], $frame->values['isSettled']],
        );
    }

    public function test_a_repaired_change_records_the_model_it_was_repaired_with_once_applied(): void
    {
        [$host, $opened] = $this->openRuntime();
        $request = DriverRequest::query()->findOrFail($this->change($opened, 'claude-opus-5-5')->requestId);
        $this->journal->claimRequestsOnHost($host->hostId, 10);
        $this->notifyProgress($host, $request, RequestProgress::Failed, RequestOutcome::Refused);
        $request->refresh();

        $this->asOwner(
            new RepairDriverSettingsCommand(
                $request->id,
                $request->row_version,
                'claude-haiku-5-5',
                'that model is not offered',
            ),
        );
        $this->journal->claimRequestsOnHost($host->hostId, 10);
        $this->notifyProgress($host, $request->refresh(), RequestProgress::Applied, null);

        $this->assertSame('claude-haiku-5-5', AgentRuntime::query()->findOrFail($opened->runtimeId)->requested_model);
        $this->assertTrue($this->changeFrameOf($opened)->values['isSettled']);
    }

    public function test_a_cancelled_change_ends_it_with_nothing_recorded(): void
    {
        [, $opened] = $this->openRuntime();
        $before = AgentRuntime::query()->findOrFail($opened->runtimeId)->requested_model;
        $request = DriverRequest::query()->findOrFail($this->change($opened, 'claude-opus-5-5')->requestId);

        $this->asOwner(new CancelDriverRequestCommand($request->id, $request->row_version, 'not needed after all'));

        $this->assertSame($before, AgentRuntime::query()->findOrFail($opened->runtimeId)->requested_model);
        $this->assertTrue($this->changeFrameOf($opened)->values['isSettled']);
    }

    private function change(OpenedRuntime $opened, string $model): mixed
    {
        return $this->asOwner(
            new ChangeAgentModelCommand($this->agentIdOf($opened), $opened->sessionId, 'model-1', $model),
        );
    }

    private function notifyProgress(
        EnrolledHost $host,
        DriverRequest $request,
        RequestProgress $progress,
        RequestOutcome|null $outcome,
    ): void {
        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $request->id,
            $request->attempt_version,
            $progress,
            null,
            $outcome,
        ));
    }

    private function changeFrameOf(OpenedRuntime $opened): FrameRecord
    {
        $key = StateReferenceKeys::of(ChangeModelStateReference::class);
        $frames = AgentStackRow::query()
            ->acrossEveryAgent()
            ->forTarget(new StackTarget($this->agentIdOf($opened), $opened->sessionId))
            ->sole()
            ->frames
            ->all();

        return array_values(array_filter($frames, fn (FrameRecord $frame) => $frame->reference->typeKey === $key))[0];
    }
}
