<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Engine\Contracts\EngineLock;
use App\Engine\Contracts\MonotonicClock;
use App\Engine\Contracts\Sleeper;
use App\Engine\Contracts\Watchdog;
use App\Engine\Events\EngineTicked;
use App\Hooks\Ticks\ElapsedTime;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Container\Container;
use Illuminate\Database\DatabaseManager;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * The engine's life: it takes the lock, then runs one pass on each one-second boundary of the monotonic clock. A pass
 * that starts late runs once for the current boundary and logs the boundaries it missed; passes never overlap or catch
 * up. Each pass delivers EngineTicked, then ticks the selected frames. Ownership is checked before every pass, and a
 * stop ends the loop after the current pass.
 */
final class EngineLoop
{
    private const int NANOSECONDS_PER_SECOND = 1_000_000_000;

    private const int NANOSECONDS_PER_MILLISECOND = 1_000_000;

    public const int LOCK_LOST = 1;

    public const int STOPPED = 0;

    private bool $stopping = false;

    public function __construct(
        private readonly EngineLock $lock,
        private readonly MonotonicClock $clock,
        private readonly Sleeper $sleeper,
        private readonly Watchdog $watchdog,
        private readonly EnginePass $pass,
        private readonly EngineSettings $settings,
        private readonly Container $container,
        private readonly DatabaseManager $databases,
        private readonly LoggerInterface $log,
    ) {}

    /**
     * Ends the loop once the pass running now is done.
     */
    public function stop(): void
    {
        $this->stopping = true;
    }

    /**
     * Runs passes until stopped or until the lock is lost, and answers the process exit code.
     */
    public function run(): int
    {
        $this->lock->acquire();
        $previousPassStart = $this->clock->nanoseconds();
        $boundary = $previousPassStart;

        try {
            while (true) {
                $boundary = $this->waitForBoundaryAfter($boundary);

                if ($this->stopping) {
                    return self::STOPPED;
                }

                if (! $this->lock->isHeld()) {
                    $this->log->error('Engine lost its lock and stops');

                    return self::LOCK_LOST;
                }

                $previousPassStart = $this->runPass($boundary, $previousPassStart);
            }
        } finally {
            $this->lock->release();
            $this->databases->disconnect($this->settings->connection);
        }
    }

    /**
     * Sleeps to the next boundary and answers the boundary the pass is for: the latest one reached, after logging the
     * ones skipped on the way.
     */
    private function waitForBoundaryAfter(int $boundary): int
    {
        $next = $boundary + self::NANOSECONDS_PER_SECOND;
        $wait = $next - $this->clock->nanoseconds();

        if ($wait > 0) {
            $this->sleeper->sleep($wait);
        }

        $missed = intdiv($this->clock->nanoseconds() - $next, self::NANOSECONDS_PER_SECOND);

        if ($missed > 0) {
            $this->log->warning('Engine missed intervals', ['missed_intervals' => $missed]);
        }

        return $next + $missed * self::NANOSECONDS_PER_SECOND;
    }

    /**
     * Runs one pass under the watchdog and answers when it started.
     */
    private function runPass(int $boundary, int $previousPassStart): int
    {
        $start = $this->clock->nanoseconds();
        $event = new EngineTicked(CarbonImmutable::now(), ElapsedTime::between($previousPassStart, $start));
        $this->watchdog->arm($this->settings->watchdogSeconds);

        try {
            $this->pass->run(function () use ($event, $start): void {
                $this->container->make(EngineTickedDelivery::class)->deliver($event);
                $this->container->make(TickDelivery::class)->deliver($start);
            });
        } catch (Throwable $failure) {
            $this->log->error('Engine pass failed', ['exception' => $failure]);
        } finally {
            $this->watchdog->disarm();
        }

        $this->log->info('Engine pass', [
            'pass_lateness_ms' => intdiv($start - $boundary, self::NANOSECONDS_PER_MILLISECOND),
            'pass_duration_ms' => intdiv($this->clock->nanoseconds() - $start, self::NANOSECONDS_PER_MILLISECOND),
        ]);

        return $start;
    }
}
