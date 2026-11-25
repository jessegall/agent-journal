<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\DriverOperation;
use App\Enums\HoldReason;
use App\Enums\RequestProgress;
use App\Exceptions\DriverRequestRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Values\DriverRequestPayload;
use App\Values\StackTarget;

/**
 * Appends driver requests to a runtime's one ordered ledger inside the caller's bus transaction, locking the session,
 * then the runtime, then its requests; it does no host I/O. A repeated key with the same content gives the same
 * receipt, other content conflicts; a stopping runtime takes nothing more.
 */
final readonly class DriverRequests
{
    public function append(
        StackTarget $target,
        DriverOperation $operation,
        string $idempotencyKey,
        DriverRequestPayload $envelope,
    ): DriverRequest {
        $runtime = $this->lockedRuntime($target);
        $digest = $envelope->digestFor($operation->value);

        $existing = DriverRequest::query()->ofAgentRuntime($runtime->id)->withIdempotencyKey($idempotencyKey)->first();

        if ($existing !== null) {
            if ($existing->payload_digest === $digest) {
                return $existing;
            }

            throw DriverRequestRefused::keyConflict($idempotencyKey);
        }

        if ($runtime->activity->isStopping()) {
            throw DriverRequestRefused::stopping($target);
        }

        $request = DriverRequest::create($runtime, $operation, $idempotencyKey, $envelope);
        $request->accept();

        return $request;
    }

    /**
     * Marks earlier requests of the same operation that have not run yet as superseded: a later value of the same
     * setting replaces them.
     */
    public function supersedeEarlier(DriverRequest $request): void
    {
        DriverRequest::query()
            ->ofAgentRuntime($request->agent_runtime_id)
            ->withOperation($request->operation)
            ->where('sequence', '<', $request->sequence)
            ->withAnyProgress([
                RequestProgress::Accepted,
                RequestProgress::Staged,
            ])
            ->lockForUpdate()
            ->get()
            ->each(fn (DriverRequest $earlier) => $earlier->supersede());
    }

    /**
     * The open wake of the runtime, if one waits, so another wake raises its watermark instead of adding a row.
     */
    public function openWake(StackTarget $target): DriverRequest|null
    {
        return $this->openOf($target, DriverOperation::Wake);
    }

    /**
     * The stop already asked of the runtime and not yet ended, if one is, so a second stop of the same session and
     * process generation converges on it.
     */
    public function openStop(StackTarget $target): DriverRequest|null
    {
        return $this->openOf($target, DriverOperation::Stop);
    }

    /**
     * The request of this operation the runtime has not finished yet, if one is open.
     */
    public function openOf(StackTarget $target, DriverOperation $operation): DriverRequest|null
    {
        return DriverRequest::query()
            ->ofAgentRuntime($this->lockedRuntime($target)->id)
            ->withOperation($operation)
            ->withAnyProgress(RequestProgress::open())
            ->lockForUpdate()
            ->first();
    }

    public function holdRuntime(StackTarget $target, HoldReason $reason): void
    {
        $this->lockedRuntime($target)->holdFor($reason);
    }

    /**
     * Asks the runtime to stop: a stop request, after which it takes no more requests. The session's running helpers
     * are asked first, and the host is handed this stop only once each of them is proven stopped.
     */
    public function stop(StackTarget $target, string $idempotencyKey): DriverRequest
    {
        foreach (AgentRuntime::runningHelpersOf($target->sessionId) as $helper) {
            $this->stop($helper->session->target, "{$idempotencyKey}:helper:{$helper->agent_session_id}");
        }

        $request = $this->append($target, DriverOperation::Stop, $idempotencyKey, DriverRequestPayload::nothing());
        $this->lockedRuntime($target)->markStopping();

        return $request;
    }

    /**
     * The target's runtime, locked for a change, refused when its session has ended.
     */
    public function runtimeOf(StackTarget $target): AgentRuntime
    {
        return $this->lockedRuntime($target);
    }

    private function lockedRuntime(StackTarget $target): AgentRuntime
    {
        $session = AgentSession::query()
            ->whereKey($target->sessionId)
            ->ofAgent($target->agentId)
            ->lockForUpdate()
            ->firstOr(DriverRequestRefused::throwing()->noRuntime($target));

        if (! $session->isActive()) {
            throw DriverRequestRefused::sessionEnded($target);
        }

        return AgentRuntime::query()->ofAgentSession($target->sessionId)->lockForUpdate()->firstOr(
            DriverRequestRefused::throwing()->noRuntime($target),
        );
    }
}
