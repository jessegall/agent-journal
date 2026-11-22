<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Commands\CancelKeyScript\CancelKeyScriptCommand;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\NavigationState;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverRequest;
use App\Agents\Support\DriverRequestEndings;
use App\Engine\Events\EngineTicked;
use App\Engine\Support\EngineListenerSet;
use App\Engine\Support\EngineTickedDelivery;
use App\Engine\Support\ExpireNavigationRequestsOnTick;
use App\Hooks\Ticks\ElapsedTime;
use Carbon\CarbonImmutable;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\Engine\RunsEnginePasses;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\TestCase;

/**
 * A navigation request ends with its work: it expires on the first engine pass past its time, it is cancelled with
 * its key script or its runtime, and the host's report that the user took over interrupts it once.
 */
final class NavigationLifecycleTest extends TestCase
{
    use CommitsHookRows;
    use RaisesNavigationRequests;
    use RunsEnginePasses;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'navigation_requests',
        'accounts',
        'active_accounts',
        'process_starts',
    ];

    public function test_the_engine_registers_the_expiry_sweep(): void
    {
        $this->assertTrue($this->app->make(EngineListenerSet::class)->has(ExpireNavigationRequestsOnTick::class));
    }

    public function test_a_request_past_its_time_expires_on_the_next_pass_and_ends_its_key_script(): void
    {
        $stalled = $this->stalledScript();
        $navigation = $this->raise($stalled, 'raise-1');
        $runtime = AgentRuntime::query()->findOrFail($stalled->agent_runtime_id);
        $runtime->holdFor(HoldReason::NavigationNeeded);

        $this->travel(31)->minutes();
        $this->pass(fn () => $this->app->make(EngineTickedDelivery::class)->deliver(
            new EngineTicked(CarbonImmutable::now(), ElapsedTime::between(0, 1_000_000_000)),
        ));

        $this->assertSame(NavigationState::Expired, $navigation->fresh()?->state);
        $request = DriverRequest::query()->findOrFail($stalled->id);
        $this->assertSame([RequestProgress::Failed, RequestOutcome::EntryUnavailable], [
            $request->progress,
            $request->outcome,
        ]);
        $this->assertSame(HoldReason::None, $runtime->fresh()?->hold_reason);
    }

    public function test_cancelling_the_key_script_cancels_its_request(): void
    {
        $stalled = $this->stalledScript();
        $navigation = $this->raise($stalled, 'raise-1');

        $this->asOwner(new CancelKeyScriptCommand($stalled->id, $stalled->row_version, 'not needed'));

        $this->assertSame(NavigationState::Cancelled, $navigation->fresh()?->state);
    }

    public function test_a_runtime_that_ends_cancels_the_request_of_its_key_script(): void
    {
        $stalled = $this->stalledScript();
        $navigation = $this->raise($stalled, 'raise-1');

        $this->app->make(DriverRequestEndings::class)->closeAfterExit(AgentRuntime::query()->findOrFail($stalled->agent_runtime_id));

        $this->assertSame(NavigationState::Cancelled, $navigation->fresh()?->state);
    }

    public function test_the_hosts_report_that_the_user_took_over_interrupts_the_request_once(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'GPT-6']));
        $stalled = DriverRequest::query()->with('runtime')->findOrFail($receipt->requestId);
        $navigation = $this->raise($stalled, 'raise-1');

        $this->hostCall($host, "/host/navigation/{$navigation->id}/interrupt")->assertNoContent();
        $this->hostCall($host, "/host/navigation/{$navigation->id}/interrupt")->assertNoContent();

        $this->assertSame(NavigationState::Interrupted, $navigation->fresh()?->state);
        $this->assertSame(HoldReason::NeedsAttention, $stalled->fresh()?->hold_reason);
        $this->assertTrue($stalled->refresh()->isStoppedKeyScript());
    }
}
