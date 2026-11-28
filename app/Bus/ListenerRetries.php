<?php

declare(strict_types=1);

namespace App\Bus;

use App\Agents\Drivers\Enums\RetriedAction;
use App\Agents\Drivers\Enums\RetryOutcome;
use App\Bus\Attributes\RetriedWhenItFails;
use App\Bus\Contracts\CommandRefusal;
use App\Bus\Exceptions\CommittedFactListenerFailed;
use App\Bus\Values\ListenerRun;
use App\Events\Connections\HostProcessLost;
use App\Events\Sessions\AgentRuntimeStartProven;
use App\Events\Sessions\DriverRequestAccepted;
use App\Events\Sessions\DriverRequestApplied;
use App\Events\Sessions\SessionProcessRegistered;
use App\Jobs\RetryCommittedListener;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\RetryAttempt;
use App\Models\Hosts\HostProcess;
use App\Support\StackTransaction;
use App\Time\Contracts\ServerClock;
use App\Values\RetrySchedule;
use Illuminate\Contracts\Bus\Dispatcher as Jobs;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Events\Dispatcher as Events;
use ReflectionClass;
use Throwable;

final readonly class ListenerRetries
{
    public function __construct(
        private StackTransaction $transaction,
        private ServerClock $clock,
        private Jobs $jobs,
        private Events $events,
        private ExceptionHandler $exceptions,
    ) {}

    public function schedule(CommittedFactListenerFailed $failure): void
    {
        $run = $failure->run;

        if ($run === null || $failure->cause instanceof CommandRefusal || ! class_exists($run->listenerClass())) {
            return;
        }

        $listener = new ReflectionClass($run->listenerClass());

        if ($listener->getAttributes(RetriedWhenItFails::class) !== []) {
            $this->enqueue($run, 1);
        }
    }

    public function run(RetryCommittedListener $job): void
    {
        $attempt = $job->attemptId === null ? null : RetryAttempt::query()->findOrFail($job->attemptId);

        if ($attempt?->outcome !== null) {
            return;
        }

        try {
            $this->events->makeListener($job->run->listener)('', [$job->run->event]);
        } catch (Throwable $cause) {
            $run = $job->run;
            $this->exceptions->report(CommittedFactListenerFailed::of($run->event::class, $run->listener, $cause, $run));
            $gaveUp = RetrySchedule::isLast($job->retry);
            $this->settle($attempt, $gaveUp ? RetryOutcome::GaveUp : RetryOutcome::Failed, $cause::class);

            if (! $gaveUp && ! $cause instanceof CommandRefusal) {
                $this->enqueue($run, $job->retry + 1);
            }

            return;
        }

        $this->settle($attempt, RetryOutcome::Succeeded);
    }

    private function enqueue(ListenerRun $run, int $retry): void
    {
        $runtimeId = $this->runtimeOf($run->event);
        $now = $this->clock->now();

        $attempt = $runtimeId === null ? null : $this->transaction->run(fn () => RetryAttempt::record(
            $runtimeId,
            RetriedAction::Listener,
            $retry,
            'The agent could not continue.',
            $now,
        ));

        $job = new RetryCommittedListener($run, $retry, $attempt?->id);
        $this->jobs->dispatch($job->delay($now->addSeconds(RetrySchedule::waitBefore($retry)))->afterCommit());
    }

    private function runtimeOf(object $event): string|null
    {
        return match (true) {
            $event instanceof AgentRuntimeStartProven => $event->runtimeId,
            $event instanceof SessionProcessRegistered => AgentRuntime::findForSession($event->sessionId)?->id,
            $event instanceof DriverRequestAccepted, $event instanceof DriverRequestApplied => DriverRequest::query()->findOrFail($event->requestId)->agent_runtime_id,
            $event instanceof HostProcessLost => HostProcess::query()->findOrFail($event->processId)->agent_runtime_id,
            default => null,
        };
    }

    private function settle(RetryAttempt|null $attempt, RetryOutcome $outcome, string|null $evidence = null): void
    {
        if ($attempt !== null) {
            $this->transaction->run(fn () => $attempt->settle($outcome, $evidence));
        }
    }
}
