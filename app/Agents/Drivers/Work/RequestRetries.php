<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Work;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\HostWakeRefusal;
use App\Agents\Drivers\Enums\RequestOutcome;
use App\Agents\Drivers\Enums\RetriedAction;
use App\Agents\Drivers\Enums\RetryOutcome;
use App\Jobs\ContinueAgentWhenDue;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\RetryAttempt;
use App\Models\Hosts\HostInstruction;
use App\Time\Contracts\ServerClock;
use App\Values\RetrySchedule;
use Illuminate\Contracts\Bus\Dispatcher;

final readonly class RequestRetries
{
    private const int SWEEP_LIMIT = 100;

    public function __construct(
        private ServerClock $clock,
        private Dispatcher $jobs,
        private DriverCatalogue $drivers,
        private RuntimeWorkers $workers,
    ) {}

    public function retryIfSafe(DriverRequest $request, string $failure, string|null $processId = null): bool
    {
        if (! $request->canRetrySafely()) {
            return false;
        }

        $previous = RetryAttempt::findLatestOf($request);
        $retry = $previous->retry ?? 0;

        if ($previous !== null && RetrySchedule::isLast($retry)) {
            $previous->settle(RetryOutcome::GaveUp, $failure);

            return false;
        }

        $previous?->settle(RetryOutcome::Failed, $failure);
        $action = $request->operation === DriverOperation::Wake ? RetriedAction::Wake : RetriedAction::TurnOpen;

        $attempt = RetryAttempt::create(
            $request->agent_runtime_id,
            $action,
            $retry + 1,
            $failure,
            $this->clock->now(),
            $request->id,
            $request->attempt_version + 1,
            $processId,
        );

        $request->retryAfter($attempt->retry_at);
        $this->jobs->dispatch(new ContinueAgentWhenDue($request->id)->delay($attempt->retry_at)->afterCommit());

        return true;
    }

    public function finishWithoutRetry(DriverRequest $request, string $failure): void
    {
        if ($request->progress->isFinal()) {
            $attempt = RetryAttempt::findForVersion($request);

            if ($attempt !== null && $attempt->outcome === null) {
                $attempt->settle(RetryOutcome::Failed, $failure);
            }
        }
    }

    public function continueWhenDue(string $requestId): void
    {
        $request = DriverRequest::query()->withRuntime()->offeredAgainBy($this->clock->now())->whereKey($requestId)->first();

        if ($request !== null) {
            $this->continue($request);
        }
    }

    public function settleExpiredOpen(HostInstruction $instruction): void
    {
        if ($instruction->driver_request_id === null || ! $instruction->hasExpired()) {
            return;
        }

        $request = DriverRequest::findLockedById($instruction->driver_request_id);

        if (! $request->operation->opensTurn() || $request->progress->isFinal() || ! $instruction->isForAttemptOf($request)) {
            return;
        }

        if ($instruction->hasBeenClaimed()) {
            $request->markUncertain();
            $this->finishWithoutRetry($request, 'The host claimed the open order before it expired.');

            return;
        }

        $request->markUnavailable(RequestOutcome::EntryUnavailable);
        $request->recordRefusal(HostWakeRefusal::ContainerUnavailable, true);
        $this->retryIfSafe($request, 'The open order expired before its host claimed it.', $instruction->host_process_id);
    }

    public function sweep(): void
    {
        $requests = DriverRequest::query()->withRuntime()->offeredAgainBy($this->clock->now())
            ->limit(self::SWEEP_LIMIT)->get();

        foreach ($requests->unique('agent_runtime_id') as $request) {
            $this->continue($request);
        }
    }

    private function continue(DriverRequest $request): void
    {
        $runtime = $request->runtime;

        if ($runtime === null) {
            return;
        }

        $this->drivers->forRuntime($runtime)->continueAgent($runtime);
        $this->workers->wake($runtime);
    }
}
