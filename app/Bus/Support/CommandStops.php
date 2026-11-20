<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Contracts\CommandStops as CommandStopsContract;
use App\Bus\Contracts\StopTime;
use Closure;
use Illuminate\Container\Attributes\Scoped;
use Psr\Log\LoggerInterface;

/**
 * The absolute stop times the commands of this operation run under. A command transaction started inside one gets
 * the time left until the nearest stop, on its first attempt and on every retry, never a fresh budget. Work that runs
 * past its stop is logged, not cut off.
 */
#[Scoped]
final class CommandStops implements CommandStopsContract
{
    /**
     * @var list<StopTime>
     */
    private array $stops = [];

    public function __construct(private readonly LoggerInterface $log) {}

    /**
     * Runs the work under the stop; the stops outside it hold again afterwards, whatever the work did.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function runUntil(StopTime $stop, Closure $work): mixed
    {
        $this->stops[] = $stop;

        try {
            return $work();
        } finally {
            array_pop($this->stops);
            $overrun = -$stop->remainingMilliseconds();

            if ($overrun > 0) {
                $this->log->warning('Work ran past its stop time.', ['overrun_ms' => $overrun]);
            }
        }
    }

    /**
     * The deadline cut to the time left until the nearest stop, or the deadline itself outside every stop.
     */
    public function limit(OperationDeadline $deadline): OperationDeadline
    {
        $left = array_reduce(
            $this->stops,
            fn (int $least, StopTime $stop) => min($least, $stop->remainingMilliseconds()),
            $deadline->milliseconds,
        );

        return $left === $deadline->milliseconds ? $deadline : new OperationDeadline($left);
    }
}
