<?php

declare(strict_types=1);

namespace Tests\States;

use App\Agents\Commands\ChangeAgentEffort\ChangeAgentEffortCommand;
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
use App\Stacks\ChangeEffortState;
use App\Stacks\Decisions\StateReferenceKeys;
use App\Stacks\Support\ChangeEffortStateReference;
use App\Support\Storage\FrameRecord;
use App\Values\StackTarget;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\TestCase;

/**
 * An effort change is owned by its state from the moment it is accepted: the state holds the effort and its request,
 * takes a repaired effort in its place, records the effort on the runtime once the driver applied the request, and ends
 * with nothing recorded when the request is cancelled.
 */
#[TestsState(ChangeEffortState::class)]
final class ChangeEffortStateTest extends TestCase
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

    public function test_an_accepted_change_puts_the_state_holding_its_effort_on_the_sessions_stack(): void
    {
        [, $opened] = $this->openRuntime();
        $change = $this->change($opened, 'max');

        $frame = $this->changeFrameOf($opened);
        $this->assertSame(
            [$change->requestId, 'max', false],
            [$frame->values['requestId'], $frame->values['effort'], $frame->values['isSettled']],
        );
    }

    public function test_a_repaired_change_records_the_effort_it_was_repaired_with_once_applied(): void
    {
        [$host, $opened] = $this->openRuntime();
        $request = DriverRequest::query()->findOrFail($this->change($opened, 'high')->requestId);
        $this->journal->claimRequestsOnHost($host->hostId, 10);
        $this->report($host, $request, RequestProgress::Failed, RequestOutcome::Refused);
        $request->refresh();

        $this->asOwner(
            new RepairDriverSettingsCommand($request->id, $request->row_version, 'low', 'high is not offered'),
        );
        $this->journal->claimRequestsOnHost($host->hostId, 10);
        $this->report($host, $request->refresh(), RequestProgress::Applied, null);

        $this->assertSame('low', AgentRuntime::query()->findOrFail($opened->runtimeId)->requested_effort);
        $this->assertTrue($this->changeFrameOf($opened)->values['isSettled']);
    }

    public function test_a_cancelled_change_ends_it_with_nothing_recorded(): void
    {
        [, $opened] = $this->openRuntime();
        $before = AgentRuntime::query()->findOrFail($opened->runtimeId)->requested_effort;
        $request = DriverRequest::query()->findOrFail($this->change($opened, 'max')->requestId);

        $this->asOwner(new CancelDriverRequestCommand($request->id, $request->row_version, 'not needed after all'));

        $this->assertSame($before, AgentRuntime::query()->findOrFail($opened->runtimeId)->requested_effort);
        $this->assertTrue($this->changeFrameOf($opened)->values['isSettled']);
    }

    private function change(OpenedRuntime $opened, string $effort): mixed
    {
        return $this->asOwner(
            new ChangeAgentEffortCommand($this->agentIdOf($opened), $opened->sessionId, 'effort-1', $effort),
        );
    }

    private function report(
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
        $key = StateReferenceKeys::of(ChangeEffortStateReference::class);
        $frames = AgentStackRow::query()
            ->acrossEveryAgent()
            ->forTarget(new StackTarget($this->agentIdOf($opened), $opened->sessionId))
            ->sole()
            ->frames
            ->all();

        return array_values(array_filter($frames, fn (FrameRecord $frame) => $frame->reference->typeKey === $key))[0];
    }
}
