<?php

declare(strict_types=1);

namespace Tests\Commands\Navigation;

use App\Enums\Drivers\HoldReason;
use App\Enums\Drivers\RequestOutcome;
use App\Enums\Drivers\RequestProgress;
use App\Enums\Navigation\NavigationStatus;
use App\Events\Engine\EngineTicked;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Support\EngineListenerSet;
use App\Support\EngineTickedDelivery;
use App\Support\ExpireNavigationRequestsOnTick;
use App\Support\Ticks\ElapsedTime;
use Carbon\CarbonImmutable;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\Engine\RunsEnginePasses;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\TestCase;

/**
 * The engine registers the expiry sweep, and a request past its time expires on the next pass and ends its key
 * script.
 */
final class ExpireNavigationRequestsTest extends TestCase
{
    use CommitsHookRows;
    use RaisesNavigationRequests;
    use RunsEnginePasses;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'navigation_requests',
        'accounts',
        'active_accounts',
        'session_processes',
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

        $this->assertSame(NavigationStatus::Expired, $navigation->fresh()?->status);
        $request = DriverRequest::query()->findOrFail($stalled->id);
        $this->assertSame([RequestProgress::Failed, RequestOutcome::EntryUnavailable], [
            $request->progress,
            $request->outcome,
        ]);
        $this->assertSame(HoldReason::None, $runtime->fresh()?->hold_reason);
    }
}
