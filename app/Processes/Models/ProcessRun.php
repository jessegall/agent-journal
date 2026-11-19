<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Actors\Support\ActorIdentity;
use App\Links\Support\Linkable;
use App\Processes\Values\RunAdmission;
use App\Processes\Enums\CaptureState;
use App\Processes\Enums\LifecycleState;
use App\Processes\Enums\RunMode;
use App\Processes\Enums\ShellDialect;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * One admitted command line run under supervision (doc 21 revision 6, sections 53 and 69): its single-use admission,
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
 * @property string $stop_reason
 * @property int $update_sequence the number of the last live update sent for this run
 * @property string $stale_reason why the run's admission no longer holds, or empty while it does
 * @property string $event_key_hash
 * @property string $working_folder
 * @property array{root: array<string, mixed>, tree_digest: string} $plan
 * @property CarbonImmutable|null $consumed_at
 * @property CarbonImmutable|null $heartbeat_at
 * @property CarbonImmutable|null $started_at
 * @property CarbonImmutable|null $ended_at
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
final class ProcessRun extends Model implements ReadableModel
{
    use BelongsToOneActor, HasUlids;
    use BoundedReads;
    use Linkable;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['lifecycle' => 'queued', 'capture_state' => 'recording'];

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
            'plan' => 'array',
            'consumed_at' => 'immutable_datetime',
            'heartbeat_at' => 'immutable_datetime',
        ];
    }

    /**
     * A run admitted for the actor, queued with its plan and nothing started yet.
     */
    public static function admit(ActorIdentity $actor, RunAdmission $admission): self
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
        $run->plan = $admission->plan->toArray();
        $run->belongTo($actor);
        $run->save();

        return $run;
    }

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
        $parts = $this->parts()->readLimit(500)->get();

        return $parts->isNotEmpty() && $parts->every(fn (PartRun $part): bool => $part->lifecycle->isFinal());
    }

    /**
     * A rule, binding or policy the run was admitted under changed: an admission not yet started is refused, and a
     * running run starts no further part; parts already started keep their records.
     */
    public function markStale(string $reason): void
    {
        $this->stale_reason = $reason;
        $this->save();
    }

    /**
     * The number of the next live update of this run, one higher than the last.
     */
    public function nextUpdate(): int
    {
        $this->increment('update_sequence');

        return $this->update_sequence;
    }

    public function isRunBy(ActorIdentity $actor): bool
    {
        return $this->actor_type === $actor->type->value && $this->actor_id === $actor->id;
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
     * Consumes the admission and returns the run's new event key, shown only this once; a consumed admission
     * returns ''.
     */
    public function consumeWithEventKey(): string
    {
        if ($this->consumed_at !== null) {
            return '';
        }
        $key = bin2hex(random_bytes(32));
        $this->event_key_hash = hash('sha256', $key);
        $this->consumed_at = CarbonImmutable::now();
        $this->lifecycle = LifecycleState::Running;
        $this->started_at = $this->consumed_at;
        $this->save();

        return $key;
    }

    /**
     * Whether a host's event carries this run's event key.
     */
    public function acceptsEventKey(string $key): bool
    {
        return $this->event_key_hash !== '' && hash_equals($this->event_key_hash, hash('sha256', $key));
    }

    public function recordHeartbeat(): void
    {
        $this->heartbeat_at = CarbonImmutable::now();
        $this->save();
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
     * Records that the run was stopped and why; a stopped run never ends with a pass.
     *
     * Nothing more will be heard from the run's supervisor; its unfinished parts were marked lost.
     */
    public function markLost(): void
    {
        $this->lifecycle = LifecycleState::Lost;
        $this->save();
    }

    public function markStopped(string $reason): void
    {
        $this->lifecycle = LifecycleState::Stopped;
        $this->stop_reason = $reason;
        $this->save();
    }

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
