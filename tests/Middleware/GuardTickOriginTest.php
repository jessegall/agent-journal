<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\CommandMiddleware\GuardTickOrigin;
use App\Commands\Agents\SettleFrameTimes\SettleFrameTimesCommand;
use App\Commands\Sessions\MarkSilentSessions\MarkSilentSessionsCommand;
use App\Contracts\Time\MonotonicClock;
use App\Contracts\Time\ServerClock;
use App\Events\Hooks\StateTypesRequested;
use App\Models\Agents\EngineFrameTime;
use App\Support\EnginePass;
use App\Support\FrameBaselines;
use App\Support\StateLoading\RegisteredStateType;
use App\Support\TickDelivery;
use App\Support\Ticks\TickCommands;
use App\Support\Ticks\TickContext;
use App\Values\FrameSettlement;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Hooks\Ticks\ScriptedOccurrenceGuard;
use Tests\Fixtures\Hooks\Ticks\ScriptedTickState;
use Tests\Fixtures\Hooks\Ticks\TickScript;
use Tests\Fixtures\Hooks\Ticks\UnreadState;
use Tests\Support\BuildsTickingStacks;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\Support\FakeMonotonicClock;
use Tests\Support\FakeServerClock;
use Tests\TestCase;

/**
 * A tick's commands run one by one inside the locks of the work the tick came from: work still live lets them
 * through and a failing one stops the rest with the baseline unmoved, while work that ended meanwhile is checked,
 * refused and commits none of them, its frame settling as it is.
 */
#[TestsMiddleware(GuardTickOrigin::class)]
final class GuardTickOriginTest extends TestCase
{
    use BuildsTickingStacks;
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'agent_stacks', 'engine_frame_times'];

    private const int SECOND = 1_000_000_000;

    private TickScript $script;

    private ScriptedOccurrenceGuard $guard;

    private FakeMonotonicClock $clock;

    private FakeServerClock $serverClock;

    private CarbonImmutable $entry;

    protected function setUp(): void
    {
        parent::setUp();

        $this->script = new TickScript();
        $this->guard = new ScriptedOccurrenceGuard();
        $this->app->instance(TickScript::class, $this->script);
        $this->app->instance(ScriptedOccurrenceGuard::class, $this->guard);
        Event::listen(StateTypesRequested::class, function (StateTypesRequested $event): void {
            $event->registry->register(RegisteredStateType::named('test.ticking', ScriptedTickState::class));
            $event->registry->register(RegisteredStateType::named('test.plain', UnreadState::class));
        });
        $this->entry = CarbonImmutable::parse('2026-11-18 12:00:10');
        $this->clock = new FakeMonotonicClock(10 * self::SECOND);
        $this->serverClock = new FakeServerClock($this->entry);
        $this->app->instance(MonotonicClock::class, $this->clock);
        $this->app->instance(ServerClock::class, $this->serverClock);
    }

    public function test_a_failing_second_command_keeps_the_first_committed_and_the_baseline_unmoved(): void
    {
        $stack = $this->tickingStack('test.ticking', ['a'], $this->entry);
        $target = new StackTarget($stack->agent_id, $stack->session_id);
        $this->script->scripts['a'] = fn (TickContext $tick) => TickCommands::of(
            new SettleFrameTimesCommand([FrameSettlement::at($target, $stack->id, 'effect-of-a', $tick->now)]),
            new MarkSilentSessionsCommand(),
        );

        $this->passAt(0.0);

        $this->assertArrayHasKey('effect-of-a', EngineFrameTime::resolveSettledAtFor(['effect-of-a']));
        $this->assertSame([], EngineFrameTime::resolveSettledAtFor(['a']));
        $this->assertFalse($this->app->make(FrameBaselines::class)->has('a'));
    }

    public function test_a_tick_of_finished_work_commits_none_of_its_commands_and_settles(): void
    {
        $stack = $this->tickingStack('test.ticking', ['a'], $this->entry);
        $target = new StackTarget($stack->agent_id, $stack->session_id);
        $this->script->scripts['a'] = fn (TickContext $tick) => TickCommands::of(
            new SettleFrameTimesCommand([FrameSettlement::at($target, $stack->id, 'effect-of-a', $tick->now)]),
        );
        $this->guard->finishedSubjects = ['a'];

        $this->passAt(0.0);

        $this->assertSame([], EngineFrameTime::resolveSettledAtFor(['effect-of-a']));
        $this->assertSame(['a'], array_map(fn ($subject) => $subject->subjectId, $this->guard->checked));
        $this->assertTrue($this->app->make(FrameBaselines::class)->has('a'));
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
}
