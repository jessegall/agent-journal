<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Events\Engine\EngineTicked;
use App\Models\Drivers\TerminalView;
use App\Support\EnginePass;
use App\Support\EngineTickedDelivery;
use App\Support\Ticks\ElapsedTime;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Terminals\TakesTerminalControl;
use Tests\TestCase;

/**
 * The engine ends every view whose lease ran out unrenewed and every live view of a stopped runtime, and prunes old
 * ended views; a live view stays.
 */
final class EndTerminalViewsTest extends TestCase
{
    use CommitsHookRows;
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

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
        'terminal_views',
        'terminal_grants',
    ];

    public function test_a_lapsed_view_ends_on_the_engine_pass_and_a_live_one_stays(): void
    {
        $runtime = $this->controllableRuntime();
        $lapsed = $this->openInterest($runtime);
        $live = $this->openInterest($runtime);
        TerminalView::query()->acrossActors()->withReadInterest($lapsed)->update(['expires_at' => now()->subMinute()]);

        $this->app->make(EnginePass::class)->run(fn () => $this->app->make(EngineTickedDelivery::class)->deliver(
            new EngineTicked(CarbonImmutable::now(), ElapsedTime::between(0, 1_000_000_000)),
        ));

        $this->assertNotNull(TerminalView::query()->acrossActors()->withReadInterest($lapsed)->sole()->closed_at);
        $this->assertNull(TerminalView::query()->acrossActors()->withReadInterest($live)->sole()->closed_at);
    }
}
