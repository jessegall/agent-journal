<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Events\EngineTicked;
use App\Models\Drivers\TerminalView;
use App\Support\DriverRequestEndings;
use App\Support\EndTerminalViewsOnTick;
use App\Support\EngineListenerSet;
use App\Support\EngineTickedDelivery;
use App\Support\Ticks\ElapsedTime;
use App\Support\WatchedRuntimes;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Engine\RunsEnginePasses;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TestActors;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The host learns which runtimes are watched through its claim, at once when the list changed, and the engine ends
 * views that lapsed or whose runtime stopped; while the engine does not run, nothing ends.
 */
#[TimeLimit(seconds: 3, reason: 'It commits real rows on the hook database and empties its tables around each test.')]
final class TerminalViewOnHostTest extends TestCase
{
    use CommitsHookRows;
    use OpensTerminalRuntimes;
    use RunsEnginePasses;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const string LAPSED_VIEW = 'a view ended before the engine ran';

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'terminal_views',
    ];

    public function test_a_claim_with_an_old_watched_version_answers_at_once_with_the_watched_runtime(): void
    {
        $host = $this->enrolledHost();
        $runtime = $this->runtimeOn($host->hostId);
        TerminalView::create(TestActors::userIdentity(1), $runtime, 500, CarbonImmutable::now(), (string) Str::ulid());
        $watched = $this->app->make(WatchedRuntimes::class);

        $response = $this->hostCall($host, '/host/claim?limit=5&wait=10&watched_version=0');

        $response->assertOk();
        $this->assertSame([['runtime_id' => $runtime->id, 'interval_ms' => 500]], $response->json('watched'));
        $this->assertSame($watched->version($host->hostId), $response->json('watched_version'));
    }

    #[TimeLimit(seconds: 4, reason: 'It waits out a one second long poll.')]
    public function test_a_claim_with_the_current_version_waits_and_returns_the_same_version(): void
    {
        $host = $this->enrolledHost();
        $version = $this->app->make(WatchedRuntimes::class)->version($host->hostId);

        $response = $this->hostCall($host, "/host/claim?limit=5&wait=1&watched_version={$version}");

        $response->assertOk();
        $this->assertSame([], $response->json('watched'));
        $this->assertSame($version, $response->json('watched_version'));
    }

    public function test_a_claim_without_a_watched_version_is_refused(): void
    {
        $host = $this->enrolledHost();

        $this->hostCall($host, '/host/claim?limit=5&wait=0')->assertUnprocessable();
    }

    public function test_the_engine_registers_the_view_sweep(): void
    {
        $this->assertTrue($this->app->make(EngineListenerSet::class)->has(EndTerminalViewsOnTick::class));
    }

    public function test_an_engine_pass_ends_lapsed_views_and_views_of_stopped_runtimes(): void
    {
        $watched = $this->app->make(WatchedRuntimes::class);
        $lapsing = $this->runtimeOn('host-1');
        $stopping = $this->runtimeOn('host-2');
        $kept = $this->runtimeOn('host-3');

        $lapsed = TerminalView::create(
            TestActors::userIdentity(1),
            $lapsing,
            500,
            CarbonImmutable::now()->subMinute(),
            (string) Str::ulid(),
        );

        $ofStopped = TerminalView::create(
            TestActors::userIdentity(1),
            $stopping,
            500,
            CarbonImmutable::now(),
            (string) Str::ulid(),
        );

        $live = TerminalView::create(
            TestActors::userIdentity(1),
            $kept,
            500,
            CarbonImmutable::now(),
            (string) Str::ulid(),
        );

        $this->app->make(DriverRequestEndings::class)->closeAfterExit($stopping);
        $versions = [$watched->version('host-1'), $watched->version('host-2'), $watched->version('host-3')];

        $this->assertNull($lapsed->refresh()->closed_at, self::LAPSED_VIEW);
        $this->pass(fn () => $this->app->make(EngineTickedDelivery::class)->deliver(
            new EngineTicked(CarbonImmutable::now(), ElapsedTime::between(0, 1_000_000_000)),
        ));

        $this->assertFalse($lapsed->refresh()->isLive());
        $this->assertFalse($ofStopped->refresh()->isLive());
        $this->assertTrue($live->refresh()->isLive());
        $this->assertSame([], $watched->forHost('host-1'));
        $this->assertSame(
            [0, 0, $versions[2]],
            [$watched->version('host-1'), $watched->version('host-2'), $watched->version('host-3')],
        );
        $this->assertNotSame(0, $versions[0]);
    }

    public function test_an_engine_pass_deletes_views_ended_more_than_a_day_ago_and_keeps_fresh_ones(): void
    {
        $runtime = $this->runtimeOn('host-1');

        $old = TerminalView::create(
            TestActors::userIdentity(1),
            $runtime,
            500,
            CarbonImmutable::now()->subDays(2),
            (string) Str::ulid(),
        );

        $old->close(CarbonImmutable::now()->subDays(2));

        $fresh = TerminalView::create(
            TestActors::userIdentity(1),
            $runtime,
            500,
            CarbonImmutable::now()->subHour(),
            (string) Str::ulid(),
        );

        $fresh->close(CarbonImmutable::now()->subHour());

        $this->pass(fn () => $this->app->make(EngineTickedDelivery::class)->deliver(
            new EngineTicked(CarbonImmutable::now(), ElapsedTime::between(0, 1_000_000_000)),
        ));

        $this->assertSame([$fresh->id], TerminalView::query()->acrossActors()->pluck('id')->all());
    }
}
