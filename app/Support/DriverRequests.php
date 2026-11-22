<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\DriverOperation;
use App\Enums\HoldReason;
use App\Enums\RequestProgress;
use App\Exceptions\DriverRequestRefused;
use App\Models\AgentRuntime;
use App\Models\AgentSession;
use App\Models\DriverRequest;
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

        $existing = DriverRequest::query()->where('agent_runtime_id', $runtime->id)->where(
            'idempotency_key',
            $idempotencyKey,
        )->first();

        if ($existing !== null) {
            return $existing->payload_digest === $digest
                ? $existing
                : throw DriverRequestRefused::keyConflict($idempotencyKey);
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
     * setting replaces them (doc 40, section 15).
     */
    public function supersedeEarlier(DriverRequest $request): void
    {
        DriverRequest::query()
            ->where('agent_runtime_id', $request->agent_runtime_id)
            ->where('operation', $request->operation)
            ->where('sequence', '<', $request->sequence)
            ->whereIn('progress', [RequestProgress::Accepted, RequestProgress::Staged])
            ->lockForUpdate()
            ->get()
            ->each(fn (DriverRequest $earlier) => $earlier->supersede());
    }

    /**
     * The open wake of the runtime, if one waits, so another wake raises its watermark instead of adding a row.
     */
    public function openWake(StackTarget $target): DriverRequest|null
    {
        return DriverRequest::query()
            ->where('agent_runtime_id', $this->lockedRuntime($target)->id)
            ->where('operation', DriverOperation::Wake)
            ->whereIn('progress', [RequestProgress::Accepted, RequestProgress::Staged, RequestProgress::Applying])
            ->lockForUpdate()
            ->first();
    }

    /**
     * The stop already asked of the runtime and not yet ended, if one is, so a second stop of the same session and
     * process generation converges on it.
     */
    public function openStop(StackTarget $target): DriverRequest|null
    {
        return DriverRequest::query()
            ->where('agent_runtime_id', $this->lockedRuntime($target)->id)
            ->where('operation', DriverOperation::Stop)
            ->whereIn('progress', [RequestProgress::Accepted, RequestProgress::Staged, RequestProgress::Applying])
            ->lockForUpdate()
            ->first();
    }

    public function holdRuntime(StackTarget $target, HoldReason $reason): void
    {
        $this->lockedRuntime($target)->holdFor($reason);
    }

    /**
     * Asks the runtime to stop: a stop request, after which it takes no more requests. The session's running helpers
     * are asked first, and the host is handed this stop only once each of them is proven stopped (doc 61, story 46).
     */
    public function stop(StackTarget $target, string $idempotencyKey): DriverRequest
    {
        foreach (AgentRuntime::runningHelpersOf($target->sessionId) as $helper) {
            $this->stop($helper->session->target(), "{$idempotencyKey}:helper:{$helper->agent_session_id}");
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
            ->where('agent_id', $target->agentId)
            ->lockForUpdate()
            ->firstOr(fn () => throw DriverRequestRefused::noRuntime($target));

        if (! $session->isActive()) {
            throw DriverRequestRefused::sessionEnded($target);
        }

        return AgentRuntime::query()->where('agent_session_id', $target->sessionId)->lockForUpdate()->firstOr(
            fn () => throw DriverRequestRefused::noRuntime($target),
        );
    }
}
