<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Actors\Contracts\ServerClock;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\CommandEntrance;
use App\Engine\Commands\SettleFrameTimes;
use App\Engine\Contracts\MonotonicClock;
use App\Engine\Models\EngineFrameTime;
use App\Engine\Values\FrameSettlement;
use App\Engine\Values\TickCandidate;
use App\Hooks\Exceptions\WorkOccurrenceStale;
use App\Hooks\Ticks\ElapsedTime;
use App\Hooks\Ticks\TickContext;
use App\Hooks\Values\WorkLockSet;
use App\Reads\Support\ScopedReadMeter;
use Carbon\CarbonImmutable;
use PhpOption\Some;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * Ticks the selected frames of one pass while its budget lasts. Each frame is told the time since its own last settled
 * tick, runs its commands one by one as top-level bus calls with no stack lock held, and stops at the first failure.
 * The frames that settled get their timing checkpoints in one command at the end; only after it commits do their
 * in-memory baselines move. A frame that fails keeps its old baseline, so its next tick is told the whole interval.
 */
final readonly class TickDelivery
{
    private const int NANOSECONDS_PER_MILLISECOND = 1_000_000;

    private const int MICROSECONDS_PER_SECOND = 1_000_000;

    private const int NANOSECONDS_PER_MICROSECOND = 1_000;

    public function __construct(
        private TickCandidates $candidates,
        private FrameBaselines $baselines,
        private MonotonicClock $clock,
        private ServerClock $serverClock,
        private EngineAccess $access,
        private CommandBus $commands,
        private EngineSettings $settings,
        private TickOrigins $origins,
        private CommandEntrance $entrance,
        private LoggerInterface $log,
    ) {}

    public function deliver(int $passStartNanoseconds): void
    {
        $batch = $this->candidates->next($this->settings->batchSize);

        if ($batch->isEmpty()) {
            return;
        }

        $passNow = $this->serverClock->now();
        $passNowReading = $this->clock->nanoseconds();
        $checkpoints = EngineFrameTime::settledAtFor(
            array_map(fn (TickCandidate $candidate) => $candidate->frameId, $batch->candidates),
        );
        $settled = ScopedReadMeter::ofCurrentScope()->withinSchedule('engine ticks', function () use (
            $batch,
            $passStartNanoseconds,
            $passNow,
            $passNowReading,
            $checkpoints,
        ): array {
            $anyTicked = false;
            $settled = [];

            foreach ($batch->candidates as $candidate) {
                // Once a tick's commands ran, any stack may have changed, so every later candidate is read again.
                $current = $anyTicked ? $this->candidates->refresh($candidate) : new Some($candidate);

                if ($this->budgetSpent($passStartNanoseconds)) {
                    $this->candidates->startNextPassAt($current->getOrElse($candidate));
                    $this->log->info('Engine pass deferred ticks', ['frame' => $candidate->frameId]);

                    break;
                }

                if ($current->isEmpty()) {
                    continue;
                }

                $start = $this->clock->nanoseconds();
                $now = $passNow->addMicroseconds(intdiv($start - $passNowReading, self::NANOSECONDS_PER_MICROSECOND));

                if ($this->tick($current->get(), $now, $this->deltaFor($current->get(), $start, $now, $checkpoints))) {
                    $settled[] = [$current->get(), $now, $start];
                }

                $anyTicked = true;
            }

            return $settled;
        });

        $this->settle($settled);
    }

    /**
     * Runs one frame's tick, which only returns commands, then each command under the frame's grant with the frame's
     * work as its origin; answers whether all of it succeeded. Once the origin's work is over the tick's remaining
     * commands are dropped and the tick counts as settled, since running it again cannot bring that work back.
     */
    private function tick(TickCandidate $candidate, CarbonImmutable $now, ElapsedTime $delta): bool
    {
        $context = new TickContext($now, $delta, $candidate->enteredAt, $candidate->target);
        $grant = new FrameGrant($candidate->target, $candidate->frameId);

        return $this->access->withinFrameGrant($grant, fn () => $this->runTick($candidate, $context));
    }

    private function runTick(TickCandidate $candidate, TickContext $context): bool
    {
        try {
            $commands = $candidate->state->onTick($context);

            foreach ($commands->all() as $command) {
                $locks = WorkLockSet::for($candidate->occurrence, $command);
                $run = fn (): mixed => $this->commands->run($command);
                $this->origins->runWith(
                    $locks,
                    fn (): mixed => $this->entrance->through(CommandEntry::Application, $run),
                );
            }

            return true;
        } catch (WorkOccurrenceStale $stale) {
            $this->log->info(
                'Engine tick of finished work dropped',
                ['frame' => $candidate->frameId, 'reason' => $stale->getMessage()],
            );

            return true;
        } catch (Throwable $failure) {
            $this->log->error(
                'Engine tick failed',
                ['frame' => $candidate->frameId, 'state' => $candidate->state::class, 'exception' => $failure],
            );

            return false;
        }
    }

    /**
     * The time since the frame's last settled tick: exact from this process's own baseline, otherwise recovered from
     * the database checkpoint or the entry time and marked approximate, and never negative.
     *
     * @param  array<string, CarbonImmutable>  $checkpoints
     */
    private function deltaFor(
        TickCandidate $candidate,
        int $start,
        CarbonImmutable $now,
        array $checkpoints,
    ): ElapsedTime {
        $sinceBaseline = $this->baselines->elapsedUntil($candidate->frameId, $start);

        if ($sinceBaseline->isDefined()) {
            return $sinceBaseline->get();
        }

        $since = $checkpoints[$candidate->frameId] ?? $candidate->enteredAt;
        $microseconds = (int) $since->diffInMicroseconds($now, false);

        if ($microseconds < 0) {
            $this->log->warning('Engine recovered a frame time after now', ['frame' => $candidate->frameId]);

            return ElapsedTime::zero(true);
        }

        return ElapsedTime::fromSeconds($microseconds / self::MICROSECONDS_PER_SECOND, true);
    }

    /**
     * Writes the checkpoints of every settled frame in one command; their baselines move only once it committed.
     *
     * @param  list<array{TickCandidate, CarbonImmutable, int}>  $settled
     */
    private function settle(array $settled): void
    {
        if ($settled === []) {
            return;
        }

        $frames = array_map(
            fn (array $frame) => FrameSettlement::at(
                $frame[0]->target,
                $frame[0]->stackId,
                $frame[0]->frameId,
                $frame[1],
            ),
            $settled,
        );

        try {
            $this->access->withinMaintenance(
                SettleFrameTimes::MAINTENANCE_SCOPE,
                fn () => $this->commands->run(new SettleFrameTimes($frames)),
            );
        } catch (Throwable $failure) {
            $this->log->error('Engine could not settle frame times', ['exception' => $failure]);

            return;
        }

        foreach ($settled as [$candidate, , $start]) {
            $this->baselines->settle($candidate->frameId, $start);
        }
    }

    private function budgetSpent(int $passStartNanoseconds): bool
    {
        return $this->clock
            ->nanoseconds() - $passStartNanoseconds >= $this
            ->settings
            ->passBudgetMilliseconds * self::NANOSECONDS_PER_MILLISECOND;
    }
}
