<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Agents\Commands\DeliverAgent\DeliverAgentCommand;
use App\Agents\Commands\InterruptAgent\InterruptAgentCommand;
use App\Agents\Commands\WakeAgent\WakeAgentCommand;
use App\Agents\Drivers\Commands\NotifyRuntimeActivity\NotifyRuntimeActivityCommand;
use App\Agents\Drivers\Enums\HoldReason;
use App\Exceptions\DriverRequestRefused;
use App\Models\Agents\AgentRuntime;
use App\Processes\Enums\RuntimeActivity;
use App\Sessions\Commands\ReleaseAgentHold\ReleaseAgentHoldCommand;
use App\Sessions\OpenedRuntime;
use App\Values\DriverReceipt;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A user releases an interrupted runtime, which is offered work again only then, but never a hold the program
 * shows.
 */
#[TestsCommand(ReleaseAgentHoldCommand::class)]
final class ReleaseAgentHoldTest extends TestCase
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
     * The journal's hold is the only one: an interrupted runtime is offered no new work until a user releases it, and
     * then it is.
     */
    public function test_an_interrupted_runtime_is_offered_work_again_only_once_its_hold_is_released(): void
    {
        [$host, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $this->asOwner(new InterruptAgentCommand($agentId, $opened->sessionId, 'interrupt-1'));
        $this->journal->claimRequestsOnHost($host->hostId, 10);
        $delivery = $this->deliver($opened, 'after-interrupt', 'Go on later');

        $held = $this->journal->claimRequestsOnHost($host->hostId, 10);
        $this->asOwner(new ReleaseAgentHoldCommand($agentId, $opened->sessionId, HoldReason::Interrupted, 'go on'));
        $released = $this->journal->claimRequestsOnHost($host->hostId, 10);

        $this->assertNotContains(
            $delivery->requestId,
            array_map(fn ($request): string => $request->requestId, $held->requests),
        );
        $this->assertContains(
            $delivery->requestId,
            array_map(fn ($request): string => $request->requestId, $released->requests),
        );
    }

    public function test_a_user_releases_an_interrupt_but_never_a_hold_the_program_shows(): void
    {
        [$host, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $this->asOwner(new InterruptAgentCommand($agentId, $opened->sessionId, 'interrupt-1'));
        $this->asOwner(new WakeAgentCommand($agentId, $opened->sessionId, 'wake-after-interrupt'));
        $runtime = fn () => AgentRuntime::query()->findOrFail($opened->runtimeId);
        $this->assertSame(HoldReason::Interrupted, $runtime()->hold_reason);

        $this->asOwner(new ReleaseAgentHoldCommand($agentId, $opened->sessionId, HoldReason::Interrupted, 'go on'));
        $this->assertSame(HoldReason::None, $runtime()->hold_reason);

        $this->journal->asSystem(new NotifyRuntimeActivityCommand(
            $host->hostId,
            $opened->runtimeId,
            RuntimeActivity::Running,
            HoldReason::Compacting,
            1,
        ));
        $this->expectException(DriverRequestRefused::class);
        $this->asOwner(new ReleaseAgentHoldCommand($agentId, $opened->sessionId, HoldReason::Compacting, 'hurry'));
    }

    private function deliver(OpenedRuntime $opened, string $key, string $message): DriverReceipt
    {
        return $this->asOwner(DeliverAgentCommand::text($this->agentIdOf($opened), $opened->sessionId, $key, $message));
    }
}
