<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Enums\CaptureState;
use App\Enums\LifecycleState;
use App\Enums\PartEndType;
use App\Enums\RunLogicalResult;
use App\Enums\RunMode;
use App\Enums\RunRequestIntent;
use App\Enums\ShellDialect;
use App\Enums\Tone;
use App\Events\ProcessRunConsumed;
use App\Events\ProcessRunLost;
use App\Events\ProcessRunMarkedStale;
use App\Events\ProcessRunOutcomeUserRevoked;
use App\Events\ProcessRunOutlasted;
use App\Events\ProcessRunStopped;
use App\Events\ProcessRunUpdateCounted;
use App\Exceptions\RetryRefused;
use App\Models\Support\BelongsToOneActor;
use App\Support\ActorIdentity;
use App\Support\Cards\DockCard;
use App\Support\Cards\DockIdentity;
use App\Support\Cards\Duration;
use App\Support\Cards\Stack;
use App\Support\Cards\StateLabel;
use App\Support\Cards\Subtitle;
use App\Support\Cards\Title;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\DockDefinition;
use App\Values\ExecutionPlan;
use App\Values\RelationRead;
use App\Values\RunAdmission;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * One admitted command line run under supervision: its single-use admission,
 * whether it is a normal or an evidence run, the source and tree digests and rule revisions it was admitted under,
 * and where its lifecycle and capture stand. The actor who runs it holds it.
 *
 * @property string $id
 * @property string $admission_id
 * @property RunMode $mode
 * @property string $project_key
 * @property string|null $actor_type
 * @property string|null $actor_id
 * @property string $source_digest
 * @property ShellDialect $dialect
 * @property string $tree_digest
 * @property string $registry_revision
 * @property string $policy_revision
 * @property LifecycleState $lifecycle
 * @property CaptureState $capture_state
 * @property string|null $stop_reason
 * @property int $update_sequence the number of the last live update sent for this run
 * @property string $stale_reason why the run's admission no longer holds, or empty while it does
 * @property string $event_key_hash
 * @property string $consuming_key_hash
 * @property string $working_folder
 * @property ExecutionPlan $plan
 * @property CarbonImmutable|null $consumed_at
 * @property CarbonImmutable|null $heartbeat_at
 * @property CarbonImmutable|null $shown_in_chat_at when its agent's chat began showing it
 * @property CarbonImmutable|null $started_at
 * @property CarbonImmutable|null $ended_at
 * @property RunRequestIntent $request_intent
 * @property string|null $responsible_type
 * @property string|null $responsible_id
 * @property string|null $outcome_user_id
 * @property string $attempt_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'admission_id',
    'mode',
    'project_key',
    'source_digest',
    'dialect',
    'tree_digest',
    'registry_revision',
    'policy_revision',
    'event_key_hash',
    'working_folder',
    'plan',
])]
final class ProcessRun extends Model implements Dockable, EventSource, ReadableModel
{
    use BelongsToOneActor;
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * The type a run docks under.
     */
    public const string DOCK_TYPE = 'process.run';

    /**
     * How long a quick command runs at most; a run past it shows in its agent's chat.
     */
    public const int QUICK_COMMAND_SECOND_LIMIT = 10;

    /**
     * The most parts, attempts included, a docked run loads with its card.
     */
    public const int DOCK_PART_LIMIT = 500;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['lifecycle' => 'queued', 'capture_state' => 'recording'];

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'mode' => RunMode::class,
            'dialect' => ShellDialect::class,
            'lifecycle' => LifecycleState::class,
            'capture_state' => CaptureState::class,
            'started_at' => 'immutable_datetime',
            'ended_at' => 'immutable_datetime',
            'plan' => ExecutionPlan::class,
            'consumed_at' => 'immutable_datetime',
            'heartbeat_at' => 'immutable_datetime',
            'shown_in_chat_at' => 'immutable_datetime',
            'request_intent' => RunRequestIntent::class,
        ];
    }

    /**
     * A run admitted for the actor, queued with its plan and nothing started yet.
     */
    public static function create(ActorIdentity $actor, RunAdmission $admission): self
    {
        $run = new self();
        $run->admission_id = $admission->admissionId;
        $run->mode = $admission->mode;
        $run->project_key = $admission->projectKey;
        $run->source_digest = $admission->sourceDigest;
        $run->dialect = $admission->dialect;
        $run->tree_digest = $admission->plan->treeDigest;
        $run->registry_revision = $admission->registryRevision;
        $run->policy_revision = $admission->policyRevision;
        $run->working_folder = $admission->workingFolder;
        $run->plan = $admission->plan;
        $run->request_intent = $admission->intent;
        $run->responsible_type = $admission->intent->isRequested() ? $actor->type->value : null;
        $run->responsible_id = $admission->intent->isRequested() ? $actor->id : null;
        $run->outcome_user_id = $admission->outcomeUserId;
        $run->attempt_id = $run->newUniqueId();
        $run->belongTo($actor);
        $run->save();

        return $run;
    }

    // ----------[ Queries ]----------

    /**
     * The run with that id whichever actor owns it, for the journal's own work on a run it was handed.
     */
    public static function ofAnyActor(string $id): self
    {
        return self::query()->acrossActors()->findOrFail($id);
    }

    /**
     * The run under its row lock, whichever actor owns it: the lock its attempt's one result is recorded under.
     */
    public static function lockedForOutcome(string $id): self
    {
        return self::query()->acrossActors()->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    // ----------[ Mutations ]----------

    /**
     * A rule, binding or policy the run was admitted under changed: an admission not yet started is refused, and a
     * running run starts no further part; parts already started keep their records.
     */
    public function markStale(string $reason): void
    {
        $this->stale_reason = $reason;
        $this->save();
        $this->raise(new ProcessRunMarkedStale($this->id, $reason));
    }

    /**
     * The number of the next live update of this run, one higher than the last.
     */
    public function nextUpdate(): int
    {
        $this->update_sequence++;
        $this->save();
        $this->raise(new ProcessRunUpdateCounted($this->id, $this->update_sequence));

        return $this->update_sequence;
    }

    /**
     * Consumes the run for the request key and answers its event key, derived from the run and the key so the same
     * key gets the same event key again while the host has sent nothing for the run; a run consumed under another key,
     * or one its host already reported on, answers null and starts nothing again.
     */
    public function consumeFor(string $requestKey, string $appKey): string|null
    {
        $keyHash = hash('sha256', $requestKey);
        $eventKey = hash_hmac('sha256', $this->id.$requestKey, $appKey);

        if ($this->consumed_at !== null) {
            $sameKey = hash_equals($this->consuming_key_hash, $keyHash);

            return $sameKey && ! $this->hasHeardFromItsHost() ? $eventKey : null;
        }

        $this->consuming_key_hash = $keyHash;
        $this->event_key_hash = hash('sha256', $eventKey);
        $this->consumed_at = CarbonImmutable::now();
        $this->lifecycle = LifecycleState::Running;
        $this->started_at = $this->consumed_at;
        $this->save();
        $this->raise(new ProcessRunConsumed($this->id));

        return $eventKey;
    }

    /**
     * Notes that the run still lives; an agent's run that has gone on past a quick command's wait is shown in its chat,
     * once.
     */
    public function recordHeartbeat(): void
    {
        $this->heartbeat_at = CarbonImmutable::now();
        $outlasted = $this->outlastsAQuickCommand();

        if ($outlasted) {
            $this->shown_in_chat_at = $this->heartbeat_at;
        }

        $this->assertSaved($this->save());

        if ($outlasted) {
            $this->raise(new ProcessRunOutlasted($this->id, $this->owningActor()));
        }
    }

    /**
     * Whether an agent's run, not yet shown in its chat, has run longer than a quick command waits.
     */
    private function outlastsAQuickCommand(): bool
    {
        return $this->shown_in_chat_at === null
            && $this->actor_type === ActorType::Agent->value
            && $this->started_at?->addSeconds(self::QUICK_COMMAND_SECOND_LIMIT)->isPast() === true;
    }

    /**
     * Records that the run was stopped and why; a stopped run never ends with a pass.
     *
     * Nothing more will come from the run's supervisor; its unfinished parts were marked lost.
     */
    public function markLost(): void
    {
        $this->lifecycle = LifecycleState::Lost;
        $this->save();
        $this->raise(new ProcessRunLost($this->id));
    }

    public function markStopped(string $reason): void
    {
        $this->lifecycle = LifecycleState::Stopped;
        $this->stop_reason = $reason;
        $this->save();
        $this->raise(new ProcessRunStopped($this->id, $reason));
    }

    /**
     * The user a request on the run's behalf entitled to its outcome no longer is.
     */
    public function revokeOutcomeUser(): void
    {
        $this->outcome_user_id = null;
        $this->save();
        $this->raise(new ProcessRunOutcomeUserRevoked($this->id));
    }

    // ----------[ Answers ]----------

    /**
     * Whether its result may answer the agent: an evidence run never gets a result receipt.
     *
     * Whether every part ended on its own and its output was captured complete, as a sample must to be evidence.
     */
    public function hasCompleteEvidence(): bool
    {
        $parts = $this->parts()->readLimit(500)->get();

        return $parts->isNotEmpty() && $parts->every(
            fn (PartRun $part): bool => $part->lifecycle === LifecycleState::Ended
                && $part->capture_state === CaptureState::Complete,
        );
    }

    /**
     * Whether every part of the run has reached a final state, so its evidence can be judged.
     */
    public function hasEnded(): bool
    {
        return self::allPartsFinal($this->parts()->readLimit(500)->get());
    }

    /**
     * A user stops what survived a lost run; only a lost run has survivors to stop.
     */
    public function stopSurvivors(): void
    {
        if ($this->lifecycle !== LifecycleState::Lost) {
            throw RetryRefused::notLost($this->id);
        }

        $this->markStale('stopped: the run was lost and a user stopped what survived');
    }

    /**
     * Who hears of the attempt's result: the responsible actor and the user a request on its behalf entitled. A
     * success reaches them only for a run someone asked for, a failure or an unknown result always, a stop never.
     *
     * @return list<ActorIdentity>
     */
    public function outcomeRecipients(RunLogicalResult $result): array
    {
        $isTold = match ($result) {
            RunLogicalResult::Succeeded => $this->request_intent->isRequested(),
            RunLogicalResult::Failed, RunLogicalResult::Unknown => true,
            RunLogicalResult::Stopped => false,
        };

        return $isTold ? $this->outcomeAudience() : [];
    }

    /**
     * Whether the actor is the run's responsible actor or the user its request entitled to the outcome.
     */
    public function hasOutcomeFor(ActorIdentity $actor): bool
    {
        foreach ($this->outcomeAudience() as $member) {
            if ($member->type === $actor->type && $member->id === $actor->id) {
                return true;
            }
        }

        return false;
    }

    public function isStopped(): bool
    {
        return $this->lifecycle === LifecycleState::Stopped;
    }

    public function isStale(): bool
    {
        return $this->stale_reason !== '';
    }

    public function mayAnswer(): bool
    {
        return $this->mode === RunMode::Normal;
    }

    /**
     * Whether the host that took the run has sent anything for it: a heartbeat or a part.
     */
    public function hasHeardFromItsHost(): bool
    {
        return $this->heartbeat_at !== null || $this->parts()->exists();
    }

    /**
     * Whether a host's event carries this run's event key.
     */
    public function acceptsEventKey(string $key): bool
    {
        return $this->event_key_hash !== '' && hash_equals($this->event_key_hash, hash('sha256', $key));
    }

    /**
     * Whether the host has gone quiet: no heartbeat for longer than the suspect limit while the run is running.
     */
    public function hasMissedHeartbeats(int $quietSeconds = 15): bool
    {
        $lastSign = $this->heartbeat_at ?? $this->started_at;

        return $this->lifecycle === LifecycleState::Running
            && $lastSign?->lessThan(CarbonImmutable::now()->subSeconds($quietSeconds)) === true;
    }

    /**
     * The latest attempt of the part at a syntax node of the run.
     *
     * @throws ModelNotFoundException
     */
    public function latestAttemptAt(int $node): PartRun
    {
        return $this->parts()->where('syntax_node', $node)->orderByDesc('attempt')->firstOrFail();
    }

    public function identifyFor(DockDefinition $definition): DockIdentity
    {
        return $definition->identity($this->id);
    }

    /**
     * Its card in a dock, from its loaded parts: the operation it runs, never its arguments, whether it still runs,
     * how long it ran, frozen at its end, and how it ended.
     */
    public function composeDockCard(CardContext $context): DockCard
    {
        $parts = $this->parts->sortBy(['syntax_node', 'attempt']);
        $last = $parts->last();
        $title = $last === null ? 'Process run' : "Run of {$last->operation}";
        $ended = self::allPartsFinal($parts);
        $startedAt = $parts->first()?->started_at;

        $cardParts = [
            new Title('title', $title),
            new StateLabel('state', $ended ? 'Ended' : 'Running', $ended ? Tone::Muted : Tone::Note),
        ];

        if ($startedAt !== null) {
            $cardParts[] = new Duration('duration', $startedAt, $ended ? $last?->ended_at : null);
        }

        if ($ended && $last !== null) {
            $exit = $last->end_type === PartEndType::Exited ? "Exit {$last->end_code}" : 'Did not exit';
            $cardParts[] = new Subtitle('exit', $exit);
        }

        return DockCard::named($title, Stack::of('root', ...$cardParts));
    }

    // ----------[ Relations ]----------

    /**
     * @return HasMany<PartRun, $this>
     */
    public function parts(): HasMany
    {
        return $this->hasMany(PartRun::class);
    }

    /**
     * @return HasMany<ProcessEvent, $this>
     */
    public function events(): HasMany
    {
        return $this->hasMany(ProcessEvent::class);
    }

    // ----------[ Internals ]----------

    /**
     * The responsible actor and the entitled user, when the run has them.
     *
     * @return list<ActorIdentity>
     */
    private function outcomeAudience(): array
    {
        $audience = [];

        if ($this->responsible_type !== null && $this->responsible_id !== null) {
            $audience[] = new ActorIdentity(ActorType::from($this->responsible_type), $this->responsible_id);
        }

        if ($audience !== [] && $this->outcome_user_id !== null) {
            $audience[] = new ActorIdentity(ActorType::User, $this->outcome_user_id);
        }

        return $audience;
    }

    /**
     * Whether a run's parts have all reached a final state; a run with no part yet has not ended.
     *
     * @param  Collection<int, PartRun>  $parts
     */
    private static function allPartsFinal(Collection $parts): bool
    {
        return $parts->isNotEmpty() && $parts->every(fn (PartRun $part): bool => $part->lifecycle->isFinal());
    }

    // ----------[ Scopes ]----------

    /**
     * Runs read for a dock, with their parts.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withDockParts(Builder $query): void
    {
        $query->with(['parts' => RelationRead::complete(max: self::DOCK_PART_LIMIT)->constraint()]);
    }

    /**
     * Runs of the project that have not ended: admissions not yet started and runs still going.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unfinishedIn(Builder $query, string $projectKey): void
    {
        $query->where('project_key', $projectKey)->whereIn('lifecycle', [
            LifecycleState::Queued->value,
            LifecycleState::Running->value,
            LifecycleState::Draining->value,
        ]);
    }

    /**
     * Running runs whose supervisor has been silent longer than the replay window.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function silentSince(Builder $query, CarbonImmutable $moment): void
    {
        $query->where('lifecycle', LifecycleState::Running->value)
            ->where(fn (Builder $silent) => $silent
                ->where('heartbeat_at', '<', $moment)
                ->orWhere(fn (Builder $never) => $never->whereNull('heartbeat_at')->where('started_at', '<', $moment)));
    }
}
