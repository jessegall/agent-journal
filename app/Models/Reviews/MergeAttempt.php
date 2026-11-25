<?php

declare(strict_types=1);

namespace App\Models\Reviews;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\MergeAttemptState;
use App\Enums\MergeRefusalReason;
use App\Events\Reviews\MergeAttemptAcknowledged;
use App\Events\Reviews\MergeAttemptBecameUncertain;
use App\Events\Reviews\MergeAttemptMerged;
use App\Events\Reviews\MergeAttemptRefused;
use App\Events\Reviews\MergeAttemptResolvedByOwner;
use App\Events\Reviews\MergeAttemptStarted;
use App\Models\Support\Accessor;
use App\Models\Support\HasActorColumns;
use App\Models\Support\HasWorkColumns;
use App\Values\ApprovedHead;
use App\Values\MergeOutcome;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $decision_id
 * @property string $work_type
 * @property string $work_id
 * @property string $certificate
 * @property string $actor_type
 * @property string $actor_id
 * @property string $ask_id
 * @property int $ask_version
 * @property string $target_branch
 * @property string $base
 * @property string $head
 * @property string $import_ref
 * @property MergeAttemptState $state
 * @property ?string $target_before
 * @property ?string $result
 * @property ?MergeRefusalReason $refusal
 * @property ?string $evidence
 * @property bool $owner_attested
 * @property ?Carbon $acknowledged_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $outcome attribute
 * @property mixed $result_ref attribute
 */
#[Table('merge_attempts')]
#[Fillable([
    'decision_id',
    'work_type',
    'work_id',
    'certificate',
    'actor_type',
    'actor_id',
    'ask_id',
    'ask_version',
    'target_branch',
    'base',
    'head',
    'import_ref',
    'state',
    'target_before',
    'result',
    'refusal',
    'evidence',
    'owner_attested',
    'acknowledged_at',
])]
final class MergeAttempt extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasActorColumns;
    use HasUlids;
    use HasWorkColumns;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'ask_version' => 'integer',
            'state' => MergeAttemptState::class,
            'refusal' => MergeRefusalReason::class,
            'owner_attested' => 'boolean',
            'acknowledged_at' => 'datetime',
        ];
    }

    // ----------[ Mutations ]----------

    /**
     * Records that supervision settled the outcome, once.
     */
    public function acknowledge(): void
    {
        if ($this->acknowledged_at !== null) {
            return;
        }

        $this->acknowledged_at = Carbon::now();
        $this->assertSaved($this->save());
        $this->raise(new MergeAttemptAcknowledged($this->id));
    }

    /**
     * Records the owner's statement of how an uncertain attempt ended, labelled as attested by the owner.
     */
    public function resolveByOwner(MergeAttemptState $state, string|null $result, string $statement): void
    {
        $this->state = $state;
        $this->result = $result;
        $this->evidence = trim("{$this->evidence}\nOwner: {$statement}");
        $this->owner_attested = true;
        $this->acknowledged_at = null;
        $this->assertSaved($this->save());
        $this->raise(new MergeAttemptResolvedByOwner($this->id, $state));
    }

    public function apply(string $targetBefore): void
    {
        $this->state = MergeAttemptState::Applying;
        $this->target_before = $targetBefore;
        $this->assertSaved($this->save());
        $this->raise(new MergeAttemptStarted($this->id));
    }

    public function merged(string $result): void
    {
        $this->state = MergeAttemptState::Merged;
        $this->result = $result;
        $this->assertSaved($this->save());
        $this->raise(new MergeAttemptMerged($this->id, $result));
    }

    public function refuse(MergeRefusalReason $reason, string $evidence): void
    {
        $this->state = MergeAttemptState::Refused;
        $this->refusal = $reason;
        $this->evidence = $evidence;
        $this->assertSaved($this->save());
        $this->raise(new MergeAttemptRefused($this->id, $reason));
    }

    public function becomeUncertain(string $evidence): void
    {
        $this->state = MergeAttemptState::Uncertain;
        $this->evidence = $evidence;
        $this->assertSaved($this->save());
        $this->raise(new MergeAttemptBecameUncertain($this->id));
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<MergeOutcome, never>
     */
    protected function outcome(): Attribute
    {
        return Accessor::get(fn () => new MergeOutcome(
            $this->id,
            $this->state,
            $this->head,
            $this->target_before,
            $this->result,
            $this->refusal,
            $this->evidence,
        ));
    }

    /**
     * The ref the prospective result is kept under before it is published.
     *
     * @return Attribute<non-falsy-string, never>
     */
    protected function resultRef(): Attribute
    {
        return Accessor::get(fn () => "refs/journal/merge/{$this->id}");
    }

    // ----------[ Queries ]----------

    /**
     * The attempt of an approval, prepared once; a replay finds it.
     */
    public static function retain(ApprovedHead $approved): self
    {
        $attempt = new self([
            'decision_id' => $approved->decision->id,
            'work_type' => $approved->work->type,
            'work_id' => $approved->work->id,
            'certificate' => $approved->certificate,
            ...$approved->admitted->asColumns('actor'),
            'ask_id' => $approved->askId,
            'ask_version' => $approved->version,
            'target_branch' => $approved->targetBranch,
            'base' => $approved->base,
            'head' => $approved->head,
            'import_ref' => $approved->importRef,
            'state' => MergeAttemptState::Prepared,
        ]);

        $attempt->setAttribute($attempt->getKeyName(), $attempt->newUniqueId());
        $attempt->insertIfAbsent();

        return self::query()->ofDecision($approved->decision->id)->lockForUpdate()->sole();
    }

    /**
     * Ended attempts supervision has not settled yet, oldest first.
     *
     * @return list<self>
     */
    public static function unacknowledged(int $limit): array
    {
        return array_values(self::query()
            ->ended()
            ->notAcknowledged()
            ->leastRecentlyUpdatedFirst()
            ->readExactly($limit)
            ->get()
            ->all());
    }

    /**
     * Attempts a run left before they ended, for the engine to inspect, oldest first.
     *
     * @return list<self>
     */
    public static function interrupted(Carbon $before, int $limit): array
    {
        return array_values(self::query()
            ->unended()
            ->updatedBefore($before)
            ->leastRecentlyUpdatedFirst()
            ->readExactly($limit)
            ->get()
            ->all());
    }

    /**
     * Whether an attempt for the ask merged: the one evidence that a merge ask ended merged.
     */
    public static function hasMerged(string $askId): bool
    {
        return self::query()->ofAsk($askId)->inMergedState()->exists();
    }

    // ----------[ Scopes ]----------

    /**
     * The decision's attempt.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofDecision(Builder $query, string $decisionId): void
    {
        $query->where('decision_id', $decisionId);
    }

    /**
     * The attempts in a final state.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ended(Builder $query): void
    {
        $query->whereIn('state', MergeAttemptState::terminalValues());
    }

    /**
     * The attempts not in a final state.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unended(Builder $query): void
    {
        $query->whereNotIn('state', MergeAttemptState::terminalValues());
    }

    /**
     * The attempts no one acknowledged yet.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function notAcknowledged(Builder $query): void
    {
        $query->whereNull('acknowledged_at');
    }

    /**
     * The attempts last updated before that moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function updatedBefore(Builder $query, Carbon $before): void
    {
        $query->where('updated_at', '<', $before);
    }

    /**
     * The attempts updated longest ago first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function leastRecentlyUpdatedFirst(Builder $query): void
    {
        $query->orderBy('updated_at');
    }

    /**
     * The ask's attempts.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAsk(Builder $query, string $askId): void
    {
        $query->where('ask_id', $askId);
    }

    /**
     * The attempts that merged.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inMergedState(Builder $query): void
    {
        $query->where('state', MergeAttemptState::Merged);
    }
}
