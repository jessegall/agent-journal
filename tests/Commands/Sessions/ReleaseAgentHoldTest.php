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
use App\Models\Accounts\Account;
use App\Models\Agents\AgentRuntime;
use App\Models\Projects\Host;
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
     * A setting change the host staged waits for a turn and counts as applied only on that turn's evidence: the model
     * its output names confirms a model change, while an effort change, which no output shows, stays unconfirmed.
     */
    /**
     * A host that could not start a turn, such as a prompt its screen did not let in, reports it staged and tries no
     * more: the journal takes the request back and offers it again once its wait has passed.
     */
    /**
     * The host reports a turn's end as it saw it; the journal judges a result marked an error as a failed turn.
     */
    /**
     * A turn that runs past the journal's limit is interrupted on the next engine pass, once, and its runtime held.
     */
    /**
     * The host reports plain facts and the journal chooses the hold: an account that is not signed in, and a stop the
     * host could not prove, each leave the runtime needing attention.
     */
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

    /**
     * A host keeps the runtime of every session it ever ran, so a claim reads only those with a request waiting, and
     * more than a page of their requests when they hold that many.
     */
    /**
     * An idle runtime reports nothing between two turns, so its last report grew stale after a
     * minute and its session read as Status unknown though nothing was wrong.
     */
    /**
     * A page learns that a session's state changed from the host's report itself, so its header
     * never waits for a reload; a beat that only keeps a fresh report fresh says nothing.
     */
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
