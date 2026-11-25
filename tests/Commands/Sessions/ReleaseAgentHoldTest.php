<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Commands\Agents\DeliverAgent\DeliverAgentCommand;
use App\Commands\Agents\InterruptAgent\InterruptAgentCommand;
use App\Commands\Agents\WakeAgent\WakeAgentCommand;
use App\Commands\Drivers\ClaimDriverRequests\ClaimDriverRequestsCommand;
use App\Commands\Drivers\NotifyRuntimeActivity\NotifyRuntimeActivityCommand;
use App\Commands\Sessions\ReleaseAgentHold\ReleaseAgentHoldCommand;
use App\Enums\Drivers\HoldReason;
use App\Enums\Runs\RuntimeActivity;
use App\Exceptions\DriverRequestRefused;
use App\Models\Agents\AgentRuntime;
use App\Support\OpenedRuntime;
use App\Values\BrowserInputCapabilities;
use App\Values\DriverReceipt;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensPairChats;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * A user releases an interrupted runtime, which is offered work again only then, but never a hold the program
 * shows.
 */
final class ReleaseAgentHoldTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;
    use OpensPairChats;
    use RunsTrustedCommands;
    use SendsHostCalls;
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
     * The journal's hold is the only one: an interrupted runtime is offered no new work until a user releases it, and
     * then it is.
     */
    public function test_an_interrupted_runtime_is_offered_work_again_only_once_its_hold_is_released(): void
    {
        [$host, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $this->asOwner(new InterruptAgentCommand($agentId, $opened->sessionId, 'interrupt-1'));
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $delivery = $this->deliver($opened, 'after-interrupt', 'Go on later');

        $held = $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $this->asOwner(new ReleaseAgentHoldCommand($agentId, $opened->sessionId, HoldReason::Interrupted, 'go on'));
        $released = $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

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

        $this->asSystem(new NotifyRuntimeActivityCommand(
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
