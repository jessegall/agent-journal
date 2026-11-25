<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Commands\Agents\DeliverAgent\DeliverAgentCommand;
use App\Commands\Drivers\ClaimDriverRequests\ClaimDriverRequestsCommand;
use App\Commands\Drivers\InterruptStuckTurns\InterruptStuckTurnsHandler;
use App\Commands\Drivers\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\HoldReason;
use App\Enums\Drivers\RequestProgress;
use App\Events\Engine\EngineTicked;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Support\EnginePass;
use App\Support\EngineTickedDelivery;
use App\Support\OpenedRuntime;
use App\Support\Ticks\ElapsedTime;
use App\Values\BrowserInputCapabilities;
use App\Values\DriverReceipt;
use Carbon\CarbonImmutable;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * A turn running past the limit is interrupted once, however many engine passes see it.
 */
final class InterruptStuckTurnsTest extends TestCase
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
     * A turn that runs past the journal's limit is interrupted on the next engine pass, once, and its runtime held.
     */
    public function test_a_turn_running_past_the_limit_is_interrupted_once(): void
    {
        [$host, $opened] = $this->openRuntime(firstMessage: 'Never ends');
        $this->journal->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $request = DriverRequest::query()->findOrFail($opened->firstRequestId);
        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $request->id,
            $request->attempt_version,
            RequestProgress::Applying,
            null,
            null,
        ));

        $this->travel(InterruptStuckTurnsHandler::TURN_MINUTES_LIMIT + 1)->minutes();

        foreach ([1, 2] as $pass) {
            $this->app->make(EnginePass::class)->run(fn () => $this->app->make(EngineTickedDelivery::class)->deliver(
                new EngineTicked(CarbonImmutable::now(), ElapsedTime::between(0, 1_000_000_000)),
            ));
        }

        $this->assertSame(1, DriverRequest::query()->where('operation', DriverOperation::Interrupt)->count());
        $this->assertSame(HoldReason::Interrupted, AgentRuntime::query()->findOrFail($opened->runtimeId)->hold_reason);
    }

    private function deliver(OpenedRuntime $opened, string $key, string $message): DriverReceipt
    {
        return $this->asOwner(DeliverAgentCommand::text($this->agentIdOf($opened), $opened->sessionId, $key, $message));
    }
}
