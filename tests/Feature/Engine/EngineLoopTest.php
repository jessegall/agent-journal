<?php

declare(strict_types=1);

namespace Tests\Feature\Engine;

use App\Contracts\Processes\Watchdog;
use App\Contracts\Time\MonotonicClock;
use App\Contracts\Time\Sleeper;
use App\Support\AdvisoryEngineLock;
use App\Support\EngineListenerSet;
use App\Support\EngineLoop;
use App\Support\EngineSettings;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\Log;
use Tests\Fixtures\Engine\StoppingEngineListener;
use Tests\Support\CommitsHookRows;
use Tests\Support\FakeMonotonicClock;
use Tests\Support\FakeSleeper;
use Tests\Support\FakeWatchdog;
use Tests\Support\TerminatingSleeper;
use Tests\TestCase;

/**
 * The engine runs one pass per boundary of the monotonic clock, driven here by a fake clock that only sleeps move: a
 * stall gives one pass and a logged count of missed boundaries, a stop ends after the current pass, and a lost lock
 * ends the process with a failing exit code.
 */
final class EngineLoopTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [];

    private const int SECOND = 1_000_000_000;

    private FakeMonotonicClock $clock;

    private FakeWatchdog $watchdog;

    private DatabaseManager $databases;

    protected function setUp(): void
    {
        parent::setUp();

        $this->databases = $this->app->make(DatabaseManager::class);
        $this->app->make('config')->set(
            'database.connections.engine.database',
            $this->databases->connection()->getDatabaseName(),
        );
        $this->clock = new FakeMonotonicClock(5 * self::SECOND);
        $this->watchdog = new FakeWatchdog();
        $this->app->instance(MonotonicClock::class, $this->clock);
        $this->app->instance(Watchdog::class, $this->watchdog);
        $this->app->instance(EngineListenerSet::class, new EngineListenerSet());
    }

    protected function tearDown(): void
    {
        $this->databases->purge('engine');

        parent::tearDown();
    }

    public function test_a_ten_second_stall_gives_one_pass_and_logs_nine_missed_boundaries(): void
    {
        $log = Log::spy();
        $this->app->instance(Sleeper::class, new FakeSleeper($this->clock, 9 * self::SECOND));
        $listener = $this->stopAfter(1);

        $exitCode = $this->app->make(EngineLoop::class)->run();

        $this->assertSame(EngineLoop::STOPPED, $exitCode);
        $this->assertCount(1, $listener->received);
        $this->assertSame(10_000, $listener->received[0]->sincePrevious->milliseconds());
        $log->shouldHaveReceived('warning')->withArgs(
            fn (string $line, array $context) => $context === ['missed_intervals' => 9],
        )->once();
        $log->shouldHaveReceived('info')->withArgs(
            fn (string $line, array $context) => $line === 'Engine pass' && $context['pass_lateness_ms'] === 0,
        )->once();
    }

    public function test_passes_run_once_a_second_under_the_watchdog_and_a_stop_ends_after_the_current_pass(): void
    {
        $this->app->instance(Sleeper::class, new FakeSleeper($this->clock));
        $listener = $this->stopAfter(3);

        $exitCode = $this->app->make(EngineLoop::class)->run();

        $this->assertSame(EngineLoop::STOPPED, $exitCode);
        $this->assertSame(
            [1000, 1000, 1000],
            array_map(fn ($event) => $event->sincePrevious->milliseconds(), $listener->received),
        );
        $this->assertSame(3, $this->watchdog->armings);
        $this->assertFalse($this->watchdog->armed);
        $this->assertFalse($this->app->make(AdvisoryEngineLock::class)->isHeld());
    }

    public function test_a_lost_lock_ends_the_engine_with_a_failing_exit_code_before_the_next_pass(): void
    {
        $this->app->instance(
            Sleeper::class,
            new TerminatingSleeper($this->clock, $this->databases, $this->app->make(EngineSettings::class)->connection),
        );
        $listener = $this->stopAfter(5);

        $exitCode = $this->app->make(EngineLoop::class)->run();

        $this->assertSame(EngineLoop::LOCK_LOST, $exitCode);
        $this->assertSame([], $listener->received);
    }

    private function stopAfter(int $passes): StoppingEngineListener
    {
        $listener = new StoppingEngineListener($this->app->make(EngineLoop::class), $passes);
        $this->app->instance(StoppingEngineListener::class, $listener);
        $this->app->make(EngineListenerSet::class)->add(StoppingEngineListener::class);

        return $listener;
    }
}
