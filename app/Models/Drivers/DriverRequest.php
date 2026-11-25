<?php

declare(strict_types=1);

namespace App\Models\Drivers;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Data\Agents\DriverRequestStatus;
use App\Data\Messages\MessagePartData;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\ExpectedTiming;
use App\Enums\Drivers\HoldReason;
use App\Enums\Drivers\HostWakeRefusal;
use App\Enums\Drivers\RequestOutcome;
use App\Enums\Drivers\RequestProgress;
use App\Events\Sessions\DriverRequestAccepted;
use App\Events\Sessions\DriverRequestApplied;
use App\Events\Sessions\DriverRequestAttemptStarted;
use App\Events\Sessions\DriverRequestCancelled;
use App\Events\Sessions\DriverRequestFailed;
use App\Events\Sessions\DriverRequestGivenBack;
use App\Events\Sessions\DriverRequestHeld;
use App\Events\Sessions\DriverRequestMarkedUnavailable;
use App\Events\Sessions\DriverRequestMarkedUncertain;
use App\Events\Sessions\DriverRequestPayloadForgotten;
use App\Events\Sessions\DriverRequestRefusalRecorded;
use App\Events\Sessions\DriverRequestResolvedAsNotApplied;
use App\Events\Sessions\DriverRequestRetried;
use App\Events\Sessions\DriverRequestScriptProgressed;
use App\Events\Sessions\DriverRequestStaged;
use App\Events\Sessions\DriverRequestSuperseded;
use App\Events\Sessions\DriverRequestSuspectedDuplicate;
use App\Events\Sessions\DriverRequestWakeAcknowledged;
use App\Events\Sessions\DriverRequestWakeClaimed;
use App\Exceptions\NavigationRaiseRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Support\Accessor;
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
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\LaravelData\DataCollection;

/**
 * @property string $id
 * @property string $agent_runtime_id
 * @property int $sequence
 * @property DriverOperation $operation
 * @property string $idempotency_key
 * @property string $payload_digest
 * @property string|null $message
 * @property DataCollection<int, MessagePartData>|null $parts
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
 * @property string|null $actual_binding
 * @property int $attempt_version
 * @property int $wake_requested
 * @property int $wake_acknowledged
 * @property int|null $wake_claimed
 * @property CarbonImmutable|null $staged_at
 * @property CarbonImmutable|null $offer_after
 * @property string|null $script_id
 * @property int|null $script_version
 * @property int|null $script_step
 * @property array<string,string> $script_parameters
 * @property int|null $script_generation
 * @property string|null $script_evidence
 * @property string|null $navigation_request_id
 * @property NavigationRound|null $navigation_round
 * @property HoldReason $hold_reason
 * @property int $row_version
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $receipt
 * @property-read AgentRuntime|null $runtime
 * @property-read mixed $status
 *
 * @mixin \Eloquent
 */
final class DriverRequest extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     *
     * @column script_parameters array<string,string>
     */
    protected function casts(): array
    {
        return [
            'parts' => DataCollection::class.':'.MessagePartData::class,
            'script_parameters' => 'array',
            'navigation_round' => NavigationRound::class,
            'operation' => DriverOperation::class,
            'progress' => RequestProgress::class,
            'outcome' => RequestOutcome::class,
            'refusal_reason' => HostWakeRefusal::class,
            'no_process_created' => 'boolean',
            'expected_timing' => ExpectedTiming::class,
            'expected_observed_at' => 'immutable_datetime',
            'staged_at' => 'immutable_datetime',
            'offer_after' => 'immutable_datetime',
            'hold_reason' => HoldReason::class,
        ];
    }

    // ----------[ Constructors ]----------

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
        $request->sequence = self::resolveNextSequence($runtime);
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
        $this->assertSaved($this->save());
        $this->raise(new DriverRequestAccepted($this->id));
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
        $this->assertSaved($this->save());
        $this->raise(new DriverRequestScriptProgressed($this->id));
    }

    /**
     * Takes back a request its host could not start yet, such as a prompt the screen did not let in, to offer it
     * again from the time given.
     */
    public function giveBack(CarbonImmutable $offerAfter): void
    {
        $this->moveTo(RequestProgress::Accepted);
        $this->wake_claimed = null;
        $this->staged_at = null;
        $this->offer_after = $offerAfter;
        $this->assertSaved($this->save());
        $this->raise(new DriverRequestGivenBack($this->id));
    }

    /**
     * Hands the request to its host; a wake keeps the watermark the host claims, so a later wake stays pending.
     */
    public function stage(CarbonImmutable $at): void
    {
        $this->moveTo(RequestProgress::Staged);
        $this->wake_claimed = $this->wake_requested;
        $this->staged_at = $at;
        $this->offer_after = null;
        $this->assertSaved($this->save());
        $this->raise(new DriverRequestStaged($this->id));
    }

    /**
     * Marks the request as being carried out by attempt version $attempt, which later reports must match.
     */
    public function beginApplying(int $attempt): void
    {
        $this->moveTo(RequestProgress::Applying);
        $this->attempt_version = $attempt;
        $this->assertSaved($this->save());
        $this->raise(new DriverRequestAttemptStarted($this->id, $attempt));
    }

    public function markApplied(string $actualBinding, RequestOutcome|null $outcome = null): void
    {
        $this->moveTo(RequestProgress::Applied);
        $this->actual_binding = $actualBinding;
        $this->outcome = $outcome;
        $this->assertSaved($this->save());
        $this->raise(new DriverRequestApplied($this->id));
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
        $this->assertSaved($this->save());
        $this->raise(new DriverRequestRetried($this->id));
    }

    /**
     * Marks this new request as a possible duplicate of an uncertain one the user chose to send again.
     */
    public function markPossibleDuplicateOf(self $original): void
    {
        $this->possible_duplicate_of_id = $original->id;
        $this->assertSaved($this->save());
        $this->raise(new DriverRequestSuspectedDuplicate($this->id, $original->id));
    }

    public function hold(HoldReason $reason): void
    {
        $this->hold_reason = $reason;
        $this->row_version++;
        $this->assertSaved($this->save());
        $this->raise(new DriverRequestHeld($this->id, $reason));
    }

    /**
     * Claims the wake up to the requested watermark, so a later wake request raises it instead of adding a row.
     */
    public function claimWake(int $requested): void
    {
        $this->wake_requested = max($requested, $this->wake_requested);
        $this->row_version++;
        $this->assertSaved($this->save());
        $this->raise(new DriverRequestWakeClaimed($this->id, $requested));
    }

    public function acknowledgeWake(int $acknowledged): void
    {
        $this->wake_acknowledged = max($acknowledged, $this->wake_acknowledged);
        $this->row_version++;
        $this->assertSaved($this->save());
        $this->raise(new DriverRequestWakeAcknowledged($this->id, $acknowledged));
    }

    /**
     * Keeps why the host refused the request and whether it proved no process of the driver was made; settling a
     * start on it is the start's own decision.
     */
    public function recordRefusal(HostWakeRefusal $reason, bool $hasCreatedNoProcess): void
    {
        $this->refusal_reason = $reason;
        $this->no_process_created = $hasCreatedNoProcess;
        $this->save();
        $this->raise(new DriverRequestRefusalRecorded($this->id));
    }

    /**
     * Drops the request's payload once its host reported how it ended, as a browser writer's typed text is never kept.
     */
    public function forgetPayload(): void
    {
        $this->message = null;
        $this->parts = null;
        $this->save();
        $this->raise(new DriverRequestPayloadForgotten($this->id));
    }

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
        $this->raise(new DriverRequestResolvedAsNotApplied($this->id));
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

    public function supersede(): void
    {
        $this->finish(RequestProgress::Superseded, null);
        $this->raise(new DriverRequestSuperseded($this->id));
    }

    public function cancel(): void
    {
        $this->finish(RequestProgress::Cancelled, null);
        $this->raise(new DriverRequestCancelled($this->id));
    }

    public function fail(RequestOutcome $outcome): void
    {
        $this->finish(RequestProgress::Failed, $outcome);
        $this->raise(new DriverRequestFailed($this->id));
    }

    /**
     * The host could not carry the request out at all, such as when its runtime could not be opened; a user may
     * send it again.
     */
    public function markUnavailable(RequestOutcome $outcome): void
    {
        $this->finish(RequestProgress::Unavailable, $outcome);
        $this->raise(new DriverRequestMarkedUnavailable($this->id));
    }

    public function markUncertain(): void
    {
        $this->finish(RequestProgress::DeliveryUncertain, null);
        $this->raise(new DriverRequestMarkedUncertain($this->id));
    }

    /**
     * Takes the payload's typed columns: its message, model, effort or key script.
     */
    public function carry(DriverRequestPayload $envelope): void
    {
        $this->message = $envelope->message;

        $this->parts = MessagePartData::collect($envelope->parts, DataCollection::class);

        $this->model = $envelope->model;
        $this->effort = $envelope->effort;
        $this->script_id = $envelope->scriptId;
        $this->script_version = $envelope->scriptVersion;
        $this->script_parameters = $envelope->scriptParameters;
        $this->navigation_request_id = $envelope->navigationRound?->navigationRequestId;
        $this->navigation_round = $envelope->navigationRound;
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

    // ----------[ Predicates ]----------

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
        return in_array($this->progress, [
            RequestProgress::Failed,
            RequestProgress::Unavailable,
        ], true);
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
        return in_array($this->progress, [
            RequestProgress::Accepted,
            RequestProgress::Staged,
        ], true);
    }

    /**
     * Whether a user may say how an uncertain delivery ended; a wake has no delivery to resolve.
     */
    public function canResolve(): bool
    {
        return $this->progress === RequestProgress::DeliveryUncertain && $this->operation !== DriverOperation::Wake;
    }

    /**
     * Whether the request changes a setting of the runtime: its model or its effort.
     */
    public function changesASetting(): bool
    {
        return in_array($this->operation, [
            DriverOperation::ChangeModel,
            DriverOperation::ChangeEffort,
        ], true);
    }

    /**
     * Whether a user may repair the request in place: a setting change that failed or could not be made.
     */
    public function canRepair(): bool
    {
        return $this->changesASetting() && $this->canRetry();
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
     * Whether the stopped key script reached a step it can go on from.
     */
    public function canResumeScript(): bool
    {
        return $this->isStoppedKeyScript() && $this->script_step !== null;
    }

    /**
     * Whether this request starts the session's process: its initial wake, or the first message it was opened with.
     */
    public function isStartingRequestOf(string $sessionId): bool
    {
        return $this->isInitialWakeOf($sessionId)
            || ($this->operation === DriverOperation::Deliver && $this->sequence === 1);
    }

    /**
     * Whether this is the wake a start gives its new session, which bootstraps its driver.
     */
    public function isInitialWakeOf(string $sessionId): bool
    {
        return $this->operation === DriverOperation::Wake
            && $this->idempotency_key === InitialWakeSettlement::keyOf($sessionId);
    }

    // ----------[ Transformers ]----------

    /**
     * The request as its host receives it to carry out, bound to the runtime's session and process generation and the
     * session's supervised start, if it has one; a bootstrap is the initial wake of a start still proving its
     * conversation.
     */
    public function claimed(AgentRuntime $runtime, string|null $sessionProcessId, bool $isBootstrap): ClaimedRequest
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
            $this->navigation_round,
            $runtime->agent_session_id,
            $sessionProcessId,
            $runtime->process_generation,
            $isBootstrap,
        );
    }

    /**
     * The key script this request runs, with its version and parameters, as a navigation request's goal.
     *
     * @throws NavigationRaiseRefused
     */
    public function scriptGoal(): ScriptGoal
    {
        $this->assertKeyScript();

        return new ScriptGoal($this->script_id, $this->script_version, $this->script_parameters);
    }

    /**
     * The delivery's parts in their order; none for any other request.
     *
     * @return list<MessagePartData>
     */
    public function partList(): array
    {
        if ($this->parts === null) {
            return [];
        }

        return array_values($this->parts->all());
    }

    // ----------[ Accessors ]----------

    /**
     * What the caller who asked for this request is told: where it stands and the timing to expect.
     *
     * @return Attribute<DriverReceipt, never>
     */
    protected function receipt(): Attribute
    {
        return Accessor::get(fn () => new DriverReceipt(
            $this->id,
            $this->sequence,
            $this->operation,
            $this->progress,
            $this->expected_timing,
            $this->expected_observed_at?->toIso8601String(),
        ));
    }

    /**
     * The request as stored, for readers.
     *
     * @return Attribute<DriverRequestStatus, never>
     */
    protected function status(): Attribute
    {
        return Accessor::get(fn () => RuntimeStatuses::ofRequest($this));
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<AgentRuntime, $this>
     */
    public function runtime(): BelongsTo
    {
        return $this->belongsTo(AgentRuntime::class, 'agent_runtime_id');
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a request that runs no key script.
     *
     * @phpstan-assert !null $this->script_id
     * @phpstan-assert !null $this->script_version
     *
     * @throws NavigationRaiseRefused
     */
    private function assertKeyScript(): void
    {
        if ($this->script_id === null || $this->script_version === null) {
            throw NavigationRaiseRefused::notAKeyScript($this->id);
        }
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

    // ----------[ Queries ]----------

    /**
     * The sequence the runtime's next request takes: one past its newest.
     */
    public static function resolveNextSequence(AgentRuntime $runtime): int
    {
        return (int) self::query()->ofRuntime($runtime)->max('sequence') + 1;
    }

    // ----------[ Scopes ]----------

    /**
     * The requests that may be offered to their host at the time given: none given back to wait past it.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function offerable(Builder $query, CarbonImmutable $at): void
    {
        $query->where(
            fn (Builder $offerable) => $offerable->whereNull('offer_after')->orWhere('offer_after', '<=', $at),
        );
    }

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
     * The deliveries and wakes still applying since before this moment: turns that have run that long.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function turnsApplyingSince(Builder $query, CarbonImmutable $before): void
    {
        $query->whereIn('operation', [
            DriverOperation::Deliver,
            DriverOperation::Wake,
        ])
            ->where('progress', RequestProgress::Applying)
            ->where('updated_at', '<', $before);
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

    /**
     * The runtime's requests.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRuntime(Builder $query, AgentRuntime $runtime): void
    {
        $query->where('agent_runtime_id', $runtime->id);
    }

    /**
     * The requests still open.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function open(Builder $query): void
    {
        $query->whereIn('progress', RequestProgress::open());
    }

    /**
     * The requests that change the model or the effort.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function changingSettings(Builder $query): void
    {
        $query->whereIn('operation', [
            DriverOperation::ChangeModel,
            DriverOperation::ChangeEffort,
        ]);
    }

    /**
     * The requests in the order they were made.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inSequenceOrder(Builder $query): void
    {
        $query->orderBy('sequence');
    }

    /**
     * The rows of any of the given agent runtimes.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $ids
     */
    #[Scope]
    protected function ofAgentRuntimes(Builder $query, array|Builder|Closure $ids): void
    {
        $query->whereIn('agent_runtime_id', $ids);
    }

    /**
     * The rows of the given agent runtime.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAgentRuntime(Builder $query, string $runtimeId): void
    {
        $query->where('agent_runtime_id', $runtimeId);
    }

    /**
     * The rows of the given idempotency key.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withIdempotencyKey(Builder $query, string $idempotencyKey): void
    {
        $query->where('idempotency_key', $idempotencyKey);
    }

    /**
     * The rows of any of the given progresses.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, RequestProgress>|Builder<covariant Model>|Closure  $progresses
     */
    #[Scope]
    protected function withAnyProgress(Builder $query, array|Builder|Closure $progresses): void
    {
        $query->whereIn('progress', $progresses);
    }

    /**
     * The rows of the given operation.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withOperation(Builder $query, DriverOperation $operation): void
    {
        $query->where('operation', $operation);
    }

    /**
     * The rows of the given navigation request.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofNavigationRequest(Builder $query, string $requestId): void
    {
        $query->where('navigation_request_id', $requestId);
    }

    /**
     * The rows of any of the given operations.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, DriverOperation>|Builder<covariant Model>|Closure  $operations
     */
    #[Scope]
    protected function withAnyOperation(Builder $query, array|Builder|Closure $operations): void
    {
        $query->whereIn('operation', $operations);
    }

    /**
     * The rows of the given progress.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withProgress(Builder $query, RequestProgress $progress): void
    {
        $query->where('progress', $progress);
    }

    /**
     * The rows by sequence descending.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function bySequenceDescending(Builder $query): void
    {
        $query->orderByDesc('sequence');
    }

    /**
     * The rows by created at.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byCreatedAt(Builder $query): void
    {
        $query->orderBy('created_at');
    }

    /**
     * The rows by sequence.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function bySequence(Builder $query): void
    {
        $query->orderBy('sequence');
    }

    /**
     * The rows by updated at.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function byUpdatedAt(Builder $query): void
    {
        $query->orderBy('updated_at');
    }

    /**
     * The rows with their runtime loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withRuntime(Builder $query): void
    {
        $query->with('runtime');
    }

    /**
     * The rows with their runtime's session loaded.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withRuntimeSession(Builder $query): void
    {
        $query->with('runtime.session');
    }

    /**
     * The requests of any operation but a control one.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function excludingControl(Builder $query): void
    {
        $query->whereNotIn('operation', DriverOperation::control());
    }

    /**
     * The requests placed before the given sequence number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function before(Builder $query, int $sequence): void
    {
        $query->where('sequence', '<', $sequence);
    }
}
