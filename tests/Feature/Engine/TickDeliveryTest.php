<?php

declare(strict_types=1);

namespace Tests\Feature\Engine;

use App\Actors\Contracts\ServerClock;
use App\Agents\Support\StackTarget;
use App\Engine\Commands\MarkSilentSessions;
use App\Engine\Commands\SettleFrameTimes;
use App\Engine\Contracts\MonotonicClock;
use App\Engine\Models\EngineFrameTime;
use App\Engine\Support\EnginePass;
use App\Engine\Support\FrameBaselines;
use App\Engine\Support\TickDelivery;
use App\Engine\Values\FrameSettlement;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Ticks\ElapsedTime;
use App\Hooks\Ticks\TickCommands;
use App\Hooks\Ticks\TickContext;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Hooks\Ticks\ScriptedTickingLoader;
use Tests\Fixtures\Hooks\Ticks\UnreadLoader;
use Tests\Support\BuildsTickingStacks;
use Tests\Support\CommitsHookRows;
use Tests\Support\FakeMonotonicClock;
use Tests\Support\FakeServerClock;
use Tests\Support\SimulatedFailure;
use Tests\TestCase;

/**
 * Each tick is told the time since its own frame's last settled tick, never null: exact within one engine process,
 * recovered and approximate after a restart. Commands run one by one and stop at the first failure; only a fully
 * settled tick moves its baseline, and one failing frame does not stop the next.
 */
final class TickDeliveryTest extends TestCase
{
    use BuildsTickingStacks;
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'agent_stacks', 'engine_frame_times'];

    private const int SECOND = 1_000_000_000;

    private ScriptedTickingLoader $loader;

    private FakeMonotonicClock $clock;

    private FakeServerClock $serverClock;

    private CarbonImmutable $entry;

    protected function setUp(): void
    {
        parent::setUp();

        $this->loader = new ScriptedTickingLoader();
        Event::listen(StateTypesRequested::class, function (StateTypesRequested $event): void {
            $event->registry->register('test.ticking', $this->loader);
            $event->registry->register('test.plain', new UnreadLoader());
        });
        $this->entry = CarbonImmutable::parse('2026-11-18 12:00:10');
        $this->clock = new FakeMonotonicClock(10 * self::SECOND);
        $this->serverClock = new FakeServerClock($this->entry);
        $this->app->instance(MonotonicClock::class, $this->clock);
        $this->app->instance(ServerClock::class, $this->serverClock);
    }

    public function test_a_first_tick_a_quarter_second_after_entry_is_told_a_quarter_second_marked_approximate(): void
    {
        $this->tickingStack('test.ticking', ['a'], $this->entry);

        $this->passAt(0.25);

        $first = $this->deltasOf('a')[0];
        $this->assertEqualsWithDelta(0.25, $first->seconds(), 0.001);
        $this->assertTrue($first->isApproximate());
    }

    public function test_settled_ticks_one_point_zero_four_seconds_apart_are_told_exactly_that(): void
    {
        $this->tickingStack('test.ticking', ['a'], $this->entry);

        $this->passAt(0.0);
        $this->passAt(1.04);

        $second = $this->deltasOf('a')[1];
        $this->assertSame(1040, $second->milliseconds());
        $this->assertFalse($second->isApproximate());
    }

    public function test_a_failed_tick_keeps_its_baseline_so_the_retry_is_told_the_whole_interval(): void
    {
        $this->tickingStack('test.ticking', ['a'], $this->entry);
        $this->loader->scripts['a'] = fn (TickContext $tick) => count($this->loader->ticks['a']) === 2 ? throw SimulatedFailure::of('The tick failed.') : TickCommands::none();

        $this->passAt(0.0);
        $this->passAt(1.0);
        $this->passAt(3.0);

        $this->assertSame([0, 1000, 3000], array_map(fn ($delta) => $delta->milliseconds(), $this->deltasOf('a')));
    }

    public function test_after_a_restart_the_delta_is_recovered_from_the_checkpoint_and_marked_approximate(): void
    {
        $stack = $this->tickingStack('test.ticking', ['a'], $this->entry);
        EngineFrameTime::recordMany([FrameSettlement::at(new StackTarget($stack->agent_id, $stack->session_id), $stack->id, 'a', CarbonImmutable::parse('2026-11-18 12:00:14'))]);
        $this->app->instance(FrameBaselines::class, new FrameBaselines());

        $this->passAt(10.0);

        $recovered = $this->deltasOf('a')[0];
        $this->assertEqualsWithDelta(6.0, $recovered->seconds(), 0.001);
        $this->assertTrue($recovered->isApproximate());
    }

    public function test_a_failing_second_command_keeps_the_first_committed_and_the_baseline_unmoved(): void
    {
        $stack = $this->tickingStack('test.ticking', ['a'], $this->entry);
        $target = new StackTarget($stack->agent_id, $stack->session_id);
        $this->loader->scripts['a'] = fn (TickContext $tick) => TickCommands::of(
            new SettleFrameTimes([FrameSettlement::at($target, $stack->id, 'effect-of-a', $tick->now)]),
            new MarkSilentSessions(),
        );

        $this->passAt(0.0);

        $this->assertArrayHasKey('effect-of-a', EngineFrameTime::settledAtFor(['effect-of-a']));
        $this->assertSame([], EngineFrameTime::settledAtFor(['a']));
        $this->assertFalse($this->app->make(FrameBaselines::class)->has('a'));
    }

    public function test_a_tick_of_finished_work_commits_none_of_its_commands_and_settles(): void
    {
        $stack = $this->tickingStack('test.ticking', ['a'], $this->entry);
        $target = new StackTarget($stack->agent_id, $stack->session_id);
        $this->loader->scripts['a'] = fn (TickContext $tick) => TickCommands::of(
            new SettleFrameTimes([FrameSettlement::at($target, $stack->id, 'effect-of-a', $tick->now)]),
        );
        $this->loader->guard->finishedSubjects = ['a'];

        $this->passAt(0.0);

        $this->assertSame([], EngineFrameTime::settledAtFor(['effect-of-a']));
        $this->assertSame(['a'], array_map(fn ($subject) => $subject->subjectId, $this->loader->guard->checked));
        $this->assertTrue($this->app->make(FrameBaselines::class)->has('a'));
    }

    public function test_a_failing_frame_does_not_stop_the_next_one(): void
    {
        $this->tickingStack('test.ticking', ['a', 'b'], $this->entry);
        $this->loader->scripts['a'] = fn () => throw SimulatedFailure::of('Frame a failed.');

        $this->passAt(0.0);

        $this->assertCount(1, $this->deltasOf('b'));
        $this->assertTrue($this->app->make(FrameBaselines::class)->has('b'));
        $this->assertFalse($this->app->make(FrameBaselines::class)->has('a'));
        $this->assertSame(['b'], array_keys(EngineFrameTime::settledAtFor(['a', 'b'])));
    }

    /**
     * Runs one pass with both clocks set to the given number of seconds after the frames entered.
     */
    private function passAt(float $secondsAfterEntry): void
    {
        $this->clock->set(10 * self::SECOND + (int) round($secondsAfterEntry * self::SECOND));
        $this->serverClock->set($this->entry->addMicroseconds((int) round($secondsAfterEntry * 1_000_000)));
        $start = $this->clock->nanoseconds();

        $this->app->make(EnginePass::class)->run(fn () => $this->app->make(TickDelivery::class)->deliver($start));
    }

    /**
     * @return list<ElapsedTime>
     */
    private function deltasOf(string $subject): array
    {
        return array_map(fn (TickContext $tick) => $tick->delta, $this->loader->ticks[$subject] ?? []);
    }
}
