<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Data\DriverRequestStatus;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\ExpectedTiming;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Exceptions\NavigationRaiseRefused;
use App\Agents\Support\ClaimedRequest;
use App\Agents\Support\DriverReceipt;
use App\Agents\Values\DriverRequestPayload;
use App\Agents\Values\ScriptGoal;
use App\Agents\Values\ScriptParameter;
use App\Agents\Values\ScriptProgress;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One accepted request to a runtime's driver, in the order it was accepted: its payload, attempts, progress and
 * outcome, expected and actual timing, wake watermarks and key script progress (doc 40, sections 14 to 20).
 *
 * @property string $id
 * @property string $agent_runtime_id
 * @property int $sequence
 * @property DriverOperation $operation
 * @property string $idempotency_key
 * @property string $payload_digest
 * @property string|null $message
 * @property string|null $model
 * @property string|null $effort
 * @property RequestProgress $progress
 * @property RequestOutcome|null $outcome
 * @property ExpectedTiming $expected_timing
 * @property CarbonImmutable|null $expected_observed_at
 * @property CarbonImmutable|null $updated_at
 * @property string|null $actual_binding
 * @property int $attempt_version
 * @property int $wake_requested
 * @property int $wake_acknowledged
 * @property int|null $wake_claimed
 * @property CarbonImmutable|null $staged_at
 * @property string|null $script_id
 * @property int|null $script_version
 * @property int|null $script_step
 * @property array<string, string> $script_parameters
 * @property int|null $script_generation
 * @property string|null $script_evidence
 * @property HoldReason $hold_reason
 * @property int $row_version
 */
#[Fillable([
    'agent_runtime_id',
    'sequence',
    'operation',
    'idempotency_key',
    'payload_digest',
    'message',
    'model',
    'effort',
    'expected_timing',
    'expected_observed_at',
    'script_id',
    'script_version',
    'script_parameters',
])]
final class DriverRequest extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'script_parameters' => 'array',
            'operation' => DriverOperation::class,
            'progress' => RequestProgress::class,
            'outcome' => RequestOutcome::class,
            'expected_timing' => ExpectedTiming::class,
            'expected_observed_at' => 'immutable_datetime',
            'staged_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
            'hold_reason' => HoldReason::class,
        ];
    }

    /**
     * @return BelongsTo<AgentRuntime, $this>
     */
    public function runtime(): BelongsTo
    {
        return $this->belongsTo(AgentRuntime::class, 'agent_runtime_id');
    }

    public function accept(): void
    {
        $this->moveTo(RequestProgress::Accepted);
        $this->hold_reason = HoldReason::None;
        $this->save();
    }

    /**
     * Records where the host's key script run stands: the step it confirmed, the screen generation it matched and
     * what it saw, never a key it typed.
     */
    public function recordScriptProgress(ScriptProgress $progress): void
    {
        $this->script_step = $progress->step;
        $this->script_generation = $progress->generation;
        $this->script_evidence = mb_substr($progress->evidence, 0, 500);
        $this->save();
    }

    /**
     * Hands the request to its host; a wake keeps the watermark the host claims, so a later wake stays pending.
     */
    public function stage(CarbonImmutable $at): void
    {
        $this->moveTo(RequestProgress::Staged);
        $this->wake_claimed = $this->wake_requested;
        $this->staged_at = $at;
        $this->save();
    }

    /**
     * Marks the request as being carried out by attempt version $attempt, which later reports must match.
     */
    public function beginApplying(int $attempt): void
    {
        $this->moveTo(RequestProgress::Applying);
        $this->attempt_version = $attempt;
        $this->save();
    }

    public function markApplied(string $actualBinding, RequestOutcome|null $outcome = null): void
    {
        $this->moveTo(RequestProgress::Applied);
        $this->actual_binding = $actualBinding;
        $this->outcome = $outcome;
        $this->save();
    }

    /**
     * Its runtime's process ended for good: a stop has been done, anything else can no longer be.
     */
    public function settleAfterExit(): void
    {
        NavigationRequest::cancelOpenFor($this);
        if ($this->operation === DriverOperation::Stop) {
            $this->markApplied('process_exited');

            return;
        }

        $this->finish(RequestProgress::Unavailable, null);
    }

    /**
     * Whether the request is still at the row version the caller read.
     */
    public function isAtRowVersion(int $rowVersion): bool
    {
        return $this->row_version === $rowVersion;
    }

    /**
     * Whether a person may send the request again: it failed or was unavailable, so nothing of it was written.
     */
    public function canRetry(): bool
    {
        return in_array($this->progress, [RequestProgress::Failed, RequestProgress::Unavailable], true);
    }

    /**
     * Sends the request again under its own key, as a new attempt: a report of an older attempt is refused after it.
     */
    public function retry(): void
    {
        $this->attempt_version++;
        $this->outcome = null;
        $this->moveTo(RequestProgress::Accepted);
        $this->save();
    }

    /**
     * Whether the request has not started on its runtime, so cancelling it leaves nothing half done.
     */
    public function canCancel(): bool
    {
        return in_array($this->progress, [RequestProgress::Accepted, RequestProgress::Staged], true);
    }

    /**
     * Whether a person may say how an uncertain delivery ended; a wake has no delivery to resolve.
     */
    public function canResolve(): bool
    {
        return $this->progress === RequestProgress::DeliveryUncertain && $this->operation !== DriverOperation::Wake;
    }

    /**
     * A person found evidence that the uncertain delivery arrived.
     */
    public function resolveAsApplied(): void
    {
        $this->markApplied('resolved_by_person');
    }

    /**
     * A person found evidence that the uncertain delivery never arrived, so it may be retried.
     */
    public function resolveAsNotApplied(): void
    {
        $this->finish(RequestProgress::Unavailable, null);
    }

    /**
     * Whether the request changes a setting of the runtime: its model or its effort.
     */
    public function changesASetting(): bool
    {
        return in_array($this->operation, [DriverOperation::ChangeModel, DriverOperation::ChangeEffort], true);
    }

    /**
     * Whether a person may repair the request in place: a setting change that failed or could not be made.
     */
    public function canRepair(): bool
    {
        return $this->changesASetting() && $this->canRetry();
    }

    /**
     * Gives the failed setting change a new value in its own place in the queue, as a new attempt; the host then
     * waits for the program's evidence of it before any content behind it runs.
     */
    public function repairWith(DriverRequestPayload $payload): void
    {
        $this->carry($payload);
        $this->payload_digest = $payload->digestFor($this->operation->value);
        $this->retry();
    }

    /**
     * Whether the request is a key script stopped part way, which a person may resume or cancel.
     */
    public function isStoppedKeyScript(): bool
    {
        return $this->operation === DriverOperation::KeyScript && ! $this->progress->isFinal();
    }

    /**
     * The key script this request runs, with its version and parameters, as a navigation request's goal.
     *
     * @throws NavigationRaiseRefused
     */
    public function scriptGoal(): ScriptGoal
    {
        if ($this->script_id === null || $this->script_version === null) {
            throw NavigationRaiseRefused::notAKeyScript($this->id);
        }

        return new ScriptGoal($this->script_id, $this->script_version, $this->script_parameters);
    }

    /**
     * Whether the stopped key script reached a step it can go on from.
     */
    public function canResumeScript(): bool
    {
        return $this->isStoppedKeyScript() && $this->script_step !== null;
    }

    /**
     * Sends the key script again from its recorded step, as a new attempt; the host goes on only once that step's
     * screen is read afresh.
     */
    public function resumeScript(): void
    {
        $this->retry();
    }

    public function supersede(): void
    {
        $this->finish(RequestProgress::Superseded, null);
    }

    public function cancel(): void
    {
        $this->finish(RequestProgress::Cancelled, null);
        NavigationRequest::cancelOpenFor($this);
    }

    public function fail(RequestOutcome $outcome): void
    {
        $this->finish(RequestProgress::Failed, $outcome);
    }

    /**
     * The host could not carry the request out at all, such as when its runtime could not be opened; a person may
     * send it again.
     */
    public function markUnavailable(RequestOutcome $outcome): void
    {
        $this->finish(RequestProgress::Unavailable, $outcome);
    }

    public function markUncertain(): void
    {
        $this->finish(RequestProgress::DeliveryUncertain, null);
    }

    public function hold(HoldReason $reason): void
    {
        $this->hold_reason = $reason;
        $this->row_version++;
        $this->save();
    }

    /**
     * What the caller who asked for this request is told: where it stands and the timing to expect.
     */
    public function receipt(): DriverReceipt
    {
        return new DriverReceipt(
            $this->id,
            $this->sequence,
            $this->operation,
            $this->progress,
            $this->expected_timing,
            $this->expected_observed_at?->toIso8601String(),
        );
    }

    /**
     * The request as its host receives it to carry out.
     */
    public function claimed(): ClaimedRequest
    {
        return new ClaimedRequest(
            $this->agent_runtime_id,
            $this->id,
            $this->sequence,
            $this->attempt_version,
            $this->operation->value,
            $this->message,
            $this->model,
            $this->effort,
            $this->script_id,
            $this->script_version,
            ScriptParameter::listOf($this->script_parameters),
            $this->script_step,
        );
    }

    /**
     * The request as stored, for readers.
     */
    public function status(): DriverRequestStatus
    {
        return DriverRequestStatus::from([
            'requestId' => $this->id,
            'sequence' => $this->sequence,
            'operation' => $this->operation,
            'progress' => $this->progress,
            'outcome' => $this->outcome,
            'expectedTiming' => $this->expected_timing,
            'changedAt' => $this->updated_at?->toIso8601String(),
            'hold' => $this->hold_reason,
            'script' => $this->script_id,
            'scriptStep' => $this->script_step,
            'scriptEvidence' => $this->script_evidence,
            'rowVersion' => $this->row_version,
            'canRetry' => $this->canRetry(),
            'canCancel' => $this->canCancel(),
            'canResolve' => $this->canResolve(),
            'canResumeScript' => $this->canResumeScript(),
            'canCancelScript' => $this->isStoppedKeyScript(),
        ]);
    }

    /**
     * The next request of the runtime, for the operation and its payload, not accepted yet.
     */
    public static function queued(
        AgentRuntime $runtime,
        DriverOperation $operation,
        string $idempotencyKey,
        DriverRequestPayload $payload,
    ): self {
        $request = new self();
        $request->agent_runtime_id = $runtime->id;
        $request->sequence = (int) self::query()->where('agent_runtime_id', $runtime->id)->max('sequence') + 1;
        $request->operation = $operation;
        $request->idempotency_key = $idempotencyKey;
        $request->payload_digest = $payload->digestFor($operation->value);
        $request->expected_timing = $runtime->activity->expectedTiming();
        $request->expected_observed_at = $runtime->last_observed_at;
        $request->carry($payload);

        return $request;
    }

    /**
     * Takes the payload's typed columns: its message, model, effort or key script.
     */
    public function carry(DriverRequestPayload $payload): void
    {
        $this->message = $payload->message;
        $this->model = $payload->model;
        $this->effort = $payload->effort;
        $this->script_id = $payload->scriptId;
        $this->script_version = $payload->scriptVersion;
        $this->script_parameters = $payload->scriptParameters;
    }

    /**
     * Claims the wake up to the requested watermark, so a later wake request raises it instead of adding a row.
     */
    public function claimWake(int $requested): void
    {
        $this->wake_requested = max($requested, $this->wake_requested);
        $this->row_version++;
        $this->save();
    }

    public function acknowledgeWake(int $acknowledged): void
    {
        $this->wake_acknowledged = max($acknowledged, $this->wake_acknowledged);
        $this->row_version++;
        $this->save();
    }

    /**
     * Activity of the woken session after the host took the wake acknowledges what the host claimed: a wake promises
     * attention, not reading. A wake raised since goes back to pending for the next claim.
     */
    public function acknowledgeActivityAt(CarbonImmutable $activityAt): void
    {
        if ($this->wake_claimed === null || $this->staged_at === null || $activityAt->lessThan($this->staged_at)) {
            return;
        }

        $this->acknowledgeWake($this->wake_claimed);

        if ($this->wake_requested > $this->wake_claimed) {
            $this->accept();

            return;
        }

        $this->markApplied('session_activity');
    }

    /**
     * Settles a wake of an idle session with nothing pending: no turn starts.
     */
    public function settleWithoutWork(): void
    {
        $this->wake_acknowledged = $this->wake_requested;
        $this->markApplied('no_pending_work', RequestOutcome::NoWork);
    }

    private function finish(RequestProgress $progress, RequestOutcome|null $outcome): void
    {
        $this->moveTo($progress);
        $this->outcome = $outcome;
        $this->save();
    }

    private function moveTo(RequestProgress $progress): void
    {
        $this->progress = $progress;
        $this->row_version++;
    }
}
