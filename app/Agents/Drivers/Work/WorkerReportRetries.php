<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Work;

use App\Agents\Drivers\Enums\RetriedAction;
use App\Agents\Drivers\Enums\RetryOutcome;
use App\Agents\Drivers\Exceptions\WorkerReportFailed;
use App\Bus\Contracts\CommandRefusal;
use App\Exceptions\WorkerFenced;
use App\Models\Drivers\RetryAttempt;
use App\Models\Hosts\HostProcess;
use App\Support\StackTransaction;
use App\Time\Contracts\ServerClock;
use App\Time\Contracts\Sleeper;
use App\Values\RetrySchedule;
use Closure;
use Throwable;

final readonly class WorkerReportRetries
{
    public function __construct(
        private StackTransaction $transaction,
        private ServerClock $clock,
        private Sleeper $sleeper,
    ) {}

    /**
     * @template T
     *
     * @param  Closure(): T  $report
     * @param  Closure(): void  $renew
     * @return T
     */
    public function run(DriverWork $work, Closure $report, Closure $renew): mixed
    {
        $attempt = null;

        for ($retry = 0; ; $retry++) {
            try {
                $answer = $report();
            } catch (WorkerFenced|CommandRefusal $failure) {
                $this->settle($attempt, RetryOutcome::Failed, $failure::class);

                throw $failure;
            } catch (Throwable $failure) {
                if (RetrySchedule::isLast($retry)) {
                    $this->settle($attempt, RetryOutcome::GaveUp, $failure::class);

                    throw WorkerReportFailed::forProcess($work->processId, $failure);
                }

                $this->settle($attempt, RetryOutcome::Failed, $failure::class);
                $attempt = $this->record($work, $retry + 1, $failure);
                $this->waitBefore($retry + 1, $renew);

                continue;
            }

            $this->settle($attempt, RetryOutcome::Succeeded);

            return $answer;
        }
    }

    private function record(DriverWork $work, int $retry, Throwable $failure): RetryAttempt|null
    {
        $process = HostProcess::query()->whereKey($work->processId)->sole();

        if ($process->agent_runtime_id === null) {
            return null;
        }

        return $this->transaction->run(fn () => RetryAttempt::record(
            $process->agent_runtime_id,
            RetriedAction::WorkerReport,
            $retry,
            $failure::class,
            $this->clock->now(),
            processId: $process->id,
        ));
    }

    private function settle(RetryAttempt|null $attempt, RetryOutcome $outcome, string|null $evidence = null): void
    {
        if ($attempt !== null) {
            $this->transaction->run(fn () => $attempt->settle($outcome, $evidence));
        }
    }

    /**
     * @param  Closure(): void  $renew
     */
    private function waitBefore(int $retry, Closure $renew): void
    {
        $remainingMs = RetrySchedule::waitBefore($retry) * 1000;

        while ($remainingMs > 0) {
            $renew();
            $intervalMs = min($remainingMs, DriverWorkers::RENEW_MS);
            $this->sleeper->sleep($intervalMs * 1_000_000);
            $remainingMs -= $intervalMs;
        }
    }
}
