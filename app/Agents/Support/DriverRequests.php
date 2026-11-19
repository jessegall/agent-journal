<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\RequestProgress;
use App\Agents\Enums\RuntimeActivity;
use App\Agents\Exceptions\DriverRequestRefused;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\DriverRequest;
use App\Agents\Values\DriverRequestPayload;

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
        DriverRequestPayload $payload,
    ): DriverRequest {
        $runtime = $this->lockedRuntime($target);
        $digest = $payload->digestFor($operation->value);

        $existing = DriverRequest::query()->where('agent_runtime_id', $runtime->id)->where('idempotency_key', $idempotencyKey)->first();
        if ($existing !== null) {
            return $existing->payload_digest === $digest ? $existing : throw DriverRequestRefused::keyConflict($idempotencyKey);
        }

        if ($runtime->activity->isStopping()) {
            throw DriverRequestRefused::stopping($target);
        }

        $request = DriverRequest::query()->make([
            'agent_runtime_id' => $runtime->id,
            'sequence' => (int) DriverRequest::query()->where('agent_runtime_id', $runtime->id)->max('sequence') + 1,
            'operation' => $operation,
            'idempotency_key' => $idempotencyKey,
            'payload_digest' => $digest,
            'expected_timing' => $runtime->activity->expectedTiming(),
            'expected_observed_at' => $runtime->last_observed_at,
        ]);
        $request->carry($payload);
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

    public function holdRuntime(StackTarget $target, HoldReason $reason): void
    {
        $runtime = $this->lockedRuntime($target);
        $runtime->hold_reason = $reason;
        $runtime->save();
    }

    public function markStopping(StackTarget $target): void
    {
        $runtime = $this->lockedRuntime($target);
        $runtime->activity = RuntimeActivity::Stopping;
        $runtime->save();
    }

    private function lockedRuntime(StackTarget $target): AgentRuntime
    {
        AgentSession::query()->whereKey($target->sessionId)->where('agent_id', $target->agentId)->lockForUpdate()->first()
            ?? throw DriverRequestRefused::noRuntime($target);

        return AgentRuntime::query()->where('agent_session_id', $target->sessionId)->lockForUpdate()->first()
            ?? throw DriverRequestRefused::noRuntime($target);
    }
}
