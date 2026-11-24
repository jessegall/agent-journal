<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Drivers\MessagePart;
use App\Contracts\Records\ReadableModel;
use App\Data\Agents\DriverRequestStatus;
use App\Data\Messages\MessagePartData;
use App\Enums\DriverOperation;
use App\Enums\ExpectedTiming;
use App\Enums\HoldReason;
use App\Enums\HostWakeRefusal;
use App\Enums\RequestOutcome;
use App\Enums\RequestProgress;
use App\Exceptions\NavigationRaiseRefused;
use App\Models\Agents\AgentRuntime;
use App\Support\InitialWakeSettlement;
use App\Support\RuntimeStatuses;
use App\Values\ClaimedRequest;
use App\Values\DriverReceipt;
use App\Values\DriverRequestPayload;
use App\Values\NavigationRound;
use App\Values\ScriptGoal;
use App\Values\ScriptParameter;
use App\Values\ScriptProgress;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One accepted request to a runtime's driver, in the order it was accepted: its payload, attempts, progress and
 * outcome, expected and actual timing, wake watermarks and key script progress.
 *
 * @property string $id
 * @property string $agent_runtime_id
 * @property int $sequence
 * @property DriverOperation $operation
 * @property string $idempotency_key
 * @property string $payload_digest
 * @property string|null $message
 * @property list<array<string, mixed>>|null $parts
 * @property string|null $model
 * @property string|null $effort
 * @property RequestProgress $progress
 * @property RequestOutcome|null $outcome
 * @property HostWakeRefusal|null $refusal_reason
 * @property bool $no_process_created
 * @property int|null $retried_from_version
 * @property string|null $possible_duplicate_of_id
 * @property ExpectedTiming $expected_timing
 * @property CarbonImmutable|null $expected_observed_at
 * @property CarbonImmutable|null $created_at
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
 * @property string|null $navigation_request_id
 * @property array{request: string, row_version: int, generation: int, keys: list<string>, choose: string|null,
 *     confirm: string|null, proof: string|null, completes: string|null, next_step: int|null,
 *     type_parameter: string|null}|null $navigation_round
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
    'navigation_request_id',
    'navigation_round',
])]
final class DriverRequest extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'parts' => 'array',
            'script_parameters' => 'array',
            'navigation_round' => 'array',
            'operation' => DriverOperation::class,
            'progress' => RequestProgress::class,
            'outcome' => RequestOutcome::class,
            'refusal_reason' => HostWakeRefusal::class,
            'no_process_created' => 'boolean',
            'expected_timing' => ExpectedTiming::class,
            'expected_observed_at' => 'immutable_datetime',
            'staged_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
            'hold_reason' => HoldReason::class,
        ];
    }

    /**
     * The next request of the runtime, for the operation and its payload, not accepted yet.
     */
    public static function create(
        AgentRuntime $runtime,
        DriverOperation $operation,
        string $idempotencyKey,
        DriverRequestPayload $envelope,
    ): self {
        $request = new self();
        $request->agent_runtime_id = $runtime->id;
        $request->sequence = (int) self::query()->where('agent_runtime_id', $runtime->id)->max('sequence') + 1;
        $request->operation = $operation;
        $request->idempotency_key = $idempotencyKey;
        $request->payload_digest = $envelope->digestFor($operation->value);
        $request->expected_timing = $runtime->activity->expectedTiming();
        $request->expected_observed_at = $runtime->last_observed_at;
        $request->carry($envelope);

        return $request;
    }

    // ----------[ Mutations ]----------

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
     * A new attempt after proof that nothing ran, remembered by the row version it was made from.
     */
    public function retrySafely(): void
    {
        $this->retried_from_version = $this->row_version;
        $this->no_process_created = false;
        $this->retry();
    }

    public function retry(): void
    {
        $this->attempt_version++;
        $this->outcome = null;
        $this->moveTo(RequestProgress::Accepted);
        $this->save();
    }

    /**
     * Marks this new request as a possible duplicate of an uncertain one the user chose to send again.
     */
    public function markPossibleDuplicateOf(self $original): void
    {
        $this->possible_duplicate_of_id = $original->id;
        $this->save();
    }

    public function hold(HoldReason $reason): void
    {
        $this->hold_reason = $reason;
        $this->row_version++;
        $this->save();
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

    // ----------[ Answers ]----------

    /**
     * Its runtime's process ended for good: a stop has been done, anything else can no longer be.
     */
    public function settleAfterExit(): void
    {
        if ($this->operation === DriverOperation::Stop) {
            $this->markApplied('process_exited');

            return;
        }

        $this->finish(RequestProgress::Unavailable, null);
    }

    /**
     * Whether the request is still at the row version the caller read.
     */
    public function isAtRowVersion(int $version): bool
    {
        return $this->row_version === $version;
    }

    /**
     * Whether a user may send the request again: it failed or was unavailable, so nothing of it was written.
     */
    public function canRetry(): bool
    {
        return in_array($this->progress, [RequestProgress::Failed, RequestProgress::Unavailable], true);
    }

    /**
     * Whether a new attempt is safe: the request failed and the host proved no process of it ran. Failed or
     * unavailable alone is no proof.
     */
    public function canRetrySafely(): bool
    {
        return $this->canRetry() && $this->no_process_created;
    }

    /**
     * Whether a retry from this row version already made the current attempt, so a second tab gets that attempt.
     */
    public function wasRetriedFrom(int $rowVersion): bool
    {
        return $this->retried_from_version === $rowVersion;
    }

    /**
     * Whether the request may be sent again as a new request: only a delivery whose outcome is unknown.
     */
    public function canSendAgain(): bool
    {
        return $this->operation === DriverOperation::Deliver && $this->progress === RequestProgress::DeliveryUncertain;
    }

    /**
     * Whether the request has not started on its runtime, so cancelling it leaves nothing half done.
     */
    public function canCancel(): bool
    {
        return in_array($this->progress, [RequestProgress::Accepted, RequestProgress::Staged], true);
    }

    /**
     * Whether a user may say how an uncertain delivery ended; a wake has no delivery to resolve.
     */
    public function canResolve(): bool
    {
        return $this->progress === RequestProgress::DeliveryUncertain && $this->operation !== DriverOperation::Wake;
    }

    /**
     * A user found evidence that the uncertain delivery arrived.
     */
    public function resolveAsApplied(): void
    {
        $this->markApplied('resolved_by_user');
    }

    /**
     * A user found evidence that the uncertain delivery never arrived, so it may be retried.
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
     * Whether a user may repair the request in place: a setting change that failed or could not be made.
     */
    public function canRepair(): bool
    {
        return $this->changesASetting() && $this->canRetry();
    }

    /**
     * Gives the failed setting change a new value in its own place in the queue, as a new attempt; the host then
     * waits for the driver's evidence of it before any content behind it runs.
     */
    public function repairWith(DriverRequestPayload $envelope): void
    {
        $this->carry($envelope);
        $this->payload_digest = $envelope->digestFor($this->operation->value);
        $this->retry();
    }

    /**
     * Whether the request runs a key script.
     */
    public function isKeyScript(): bool
    {
        return $this->operation === DriverOperation::KeyScript;
    }

    /**
     * Whether the request is a key script stopped part way, which a user may resume or cancel.
     */
    public function isStoppedKeyScript(): bool
    {
        return $this->isKeyScript() && ! $this->progress->isFinal();
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

    public function supersede(): void
    {
        $this->finish(RequestProgress::Superseded, null);
    }

    public function cancel(): void
    {
        $this->finish(RequestProgress::Cancelled, null);
    }

    public function fail(RequestOutcome $outcome): void
    {
        $this->finish(RequestProgress::Failed, $outcome);
    }

    /**
     * Keeps why the host refused the request and whether it proved no process of the driver was made; settling a
     * launch on it is the start's own decision.
     */
    public function recordRefusal(HostWakeRefusal $reason, bool $noProcessCreated): void
    {
        $this->refusal_reason = $reason;
        $this->no_process_created = $noProcessCreated;
        $this->save();
    }

    /**
     * The host could not carry the request out at all, such as when its runtime could not be opened; a user may
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

    /**
     * Whether this is the wake a start gives its new session, which bootstraps its driver.
     */
    public function isInitialWakeOf(string $sessionId): bool
    {
        return $this->operation === DriverOperation::Wake
            && $this->idempotency_key === InitialWakeSettlement::keyOf($sessionId);
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
     * The request as its host receives it to carry out, bound to the runtime's session and process generation and the
     * session's supervised start, if it has one; a bootstrap is the initial wake of a start still proving its
     * conversation.
     */
    public function claimed(AgentRuntime $runtime, string|null $processStartId, bool $isBootstrap): ClaimedRequest
    {
        return new ClaimedRequest(
            $this->agent_runtime_id,
            $this->id,
            $this->sequence,
            $this->attempt_version,
            $this->operation->value,
            $this->message,
            $this->partList(),
            $this->model,
            $this->effort,
            $this->script_id,
            $this->script_version,
            ScriptParameter::listOf($this->script_parameters),
            $this->script_step,
            $this->navigation_request_id,
            $this->navigationRound(),
            $runtime->agent_session_id,
            $processStartId,
            $runtime->process_generation,
            $isBootstrap,
        );
    }

    /**
     * The delivery's parts in their order; none for any other request.
     *
     * @return list<MessagePart>
     */
    public function partList(): array
    {
        return MessagePartData::listOf($this->parts ?? []);
    }

    /**
     * Drops the request's payload once its host reported how it ended, as a browser writer's typed text is never kept.
     */
    public function forgetPayload(): void
    {
        $this->message = null;
        $this->parts = null;
        $this->save();
    }

    /**
     * The request as stored, for readers.
     */
    public function status(): DriverRequestStatus
    {
        return RuntimeStatuses::ofRequest($this);
    }

    /**
     * Takes the payload's typed columns: its message, model, effort or key script.
     */
    public function carry(DriverRequestPayload $envelope): void
    {
        $this->message = $envelope->message;

        $this->parts = $envelope->parts === []
            ? null
            : array_map(fn (MessagePart $part): array => $part->toArray(), $envelope->parts);

        $this->model = $envelope->model;
        $this->effort = $envelope->effort;
        $this->script_id = $envelope->scriptId;
        $this->script_version = $envelope->scriptVersion;
        $this->script_parameters = $envelope->scriptParameters;
        $this->navigation_request_id = $envelope->navigationRound?->navigationRequestId;
        $this->navigation_round = $envelope->navigationRound?->toStored();
    }

    /**
     * The main agent's round this request carries; none for any other operation.
     */
    public function navigationRound(): NavigationRound|null
    {
        if ($this->navigation_round === null) {
            return null;
        }

        return NavigationRound::fromStored($this->navigation_round);
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

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<AgentRuntime, $this>
     */
    public function runtime(): BelongsTo
    {
        return $this->belongsTo(AgentRuntime::class, 'agent_runtime_id');
    }

    // ----------[ Internals ]----------

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

    // ----------[ Scopes ]----------

    /**
     * The requests a runtime is still carrying out.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function applyingOn(Builder $query, AgentRuntime $runtime): void
    {
        $query->where('agent_runtime_id', $runtime->id)->where('progress', RequestProgress::Applying);
    }

    /**
     * The Check status requests no host has answered since before this moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unansweredReadinessChecksSince(Builder $query, CarbonImmutable $before): void
    {
        $query->where('operation', DriverOperation::ResendReadiness)
            ->whereIn('progress', RequestProgress::open())
            ->where('created_at', '<', $before);
    }
}
