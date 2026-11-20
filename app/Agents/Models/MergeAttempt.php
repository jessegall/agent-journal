<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Actors\Models\Support\HasActorColumns;
use App\Agents\Enums\MergeAttemptState;
use App\Agents\Enums\MergeRefusalReason;
use App\Agents\Values\ApprovedHead;
use App\Agents\Values\MergeOutcome;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Models\Support\HasWorkColumns;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The one merge of an approval: the actor, ask and version that admitted it, the exact reviewed base and head under
 * their imported ref, the target branch and the head it had before, and how it ended, with the result commit or the
 * reason the target was left as it was. A replay of the approval finds this attempt and runs no second git effect.
 *
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
 * @property string|null $target_before
 * @property string|null $result
 * @property MergeRefusalReason|null $refusal
 * @property string|null $evidence
 * @property bool $owner_attested
 * @property Carbon|null $acknowledged_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
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
final class MergeAttempt extends Model implements ReadableModel
{
    use BoundedReads;
    use HasActorColumns;
    use HasUlids;
    use HasWorkColumns;
    use Linkable;

    // ----------[ Constructors ]----------

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

    // ----------[ Queries ]----------

    /**
     * The attempt of an approval, prepared once; a replay finds it.
     */
    public static function retain(ApprovedHead $approved): self
    {
        return self::query()->lockForUpdate()->firstOrCreate(['decision_id' => $approved->decision->id], [
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
    }

    /**
     * Ended attempts supervision has not settled yet, oldest first.
     *
     * @return list<self>
     */
    public static function unacknowledged(int $limit): array
    {
        return array_values(self::query()
            ->whereIn('state', MergeAttemptState::terminalValues())
            ->whereNull('acknowledged_at')
            ->orderBy('updated_at')
            ->readLimit($limit)
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
            ->whereNotIn('state', MergeAttemptState::terminalValues())
            ->where('updated_at', '<', $before)
            ->orderBy('updated_at')
            ->readLimit($limit)
            ->get()
            ->all());
    }

    public static function lockedById(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOrFail();
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
        $this->save();
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
        $this->save();
    }

    public function apply(string $targetBefore): void
    {
        $this->state = MergeAttemptState::Applying;
        $this->target_before = $targetBefore;
        $this->save();
    }

    public function merged(string $result): void
    {
        $this->state = MergeAttemptState::Merged;
        $this->result = $result;
        $this->save();
    }

    public function refuse(MergeRefusalReason $reason, string $evidence): void
    {
        $this->state = MergeAttemptState::Refused;
        $this->refusal = $reason;
        $this->evidence = $evidence;
        $this->save();
    }

    public function becomeUncertain(string $evidence): void
    {
        $this->state = MergeAttemptState::Uncertain;
        $this->evidence = $evidence;
        $this->save();
    }

    // ----------[ Answers ]----------

    public function outcome(): MergeOutcome
    {
        return new MergeOutcome(
            $this->id,
            $this->state,
            $this->head,
            $this->target_before,
            $this->result,
            $this->refusal,
            $this->evidence,
        );
    }

    /**
     * The ref the prospective result is kept under before it is published.
     */
    public function resultRef(): string
    {
        return "refs/journal/merge/{$this->id}";
    }
}
