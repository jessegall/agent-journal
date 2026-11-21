<?php

declare(strict_types=1);

namespace App\Supervision\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Contracts\Support\InsertsAbsentRows;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Models\Support\HasWorkColumns;
use App\Supervision\Enums\RepairRequestState;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One request to repair reviewed work on the actor and checkout that did it: from a returned review or a merge that
 * conflicted, once per decision or attempt, with the findings and, for a conflict, the target commit to repair onto.
 *
 * @property string $id
 * @property string $source
 * @property string $certificate
 * @property string $work_type
 * @property string $work_id
 * @property string $worker_type
 * @property string $worker_id
 * @property string $findings
 * @property string|null $target_commit
 * @property RepairRequestState $state
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Table('repair_requests')]
#[Fillable([
    'source',
    'certificate',
    'work_type',
    'work_id',
    'worker_type',
    'worker_id',
    'findings',
    'target_commit',
    'state',
])]
final class RepairRequest extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use HasWorkColumns;
    use InsertsAbsentRows;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['state' => RepairRequestState::class];
    }

    // ----------[ Queries ]----------

    /**
     * Retains the repair a source asks for once; asking again finds it.
     */
    public static function retain(
        string $source,
        CodeReview $review,
        string $findings,
        string|null $targetCommit,
    ): self {
        $repair = new self([
            'source' => $source,
            'certificate' => $review->certificate,
            'work_type' => $review->work_type,
            'work_id' => $review->work_id,
            'worker_type' => $review->worker_type,
            'worker_id' => $review->worker_id,
            'findings' => $findings,
            'target_commit' => $targetCommit,
            'state' => RepairRequestState::Pending,
        ]);

        $repair->setAttribute($repair->getKeyName(), $repair->newUniqueId());
        $repair->insertIfAbsent();

        return self::query()->where('source', $source)->sole();
    }

    // ----------[ Mutations ]----------

    public function settle(RepairRequestState $state): void
    {
        $this->state = $state;
        $this->save();
    }

    // ----------[ Answers ]----------

    /**
     * How many repairs this work was sent back for before this one.
     */
    public function earlierRounds(): int
    {
        return self::query()
            ->where('work_type', $this->work_type)
            ->where('work_id', $this->work_id)
            ->whereKeyNot($this->id)
            ->count();
    }

    public function worker(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($this->worker_type), $this->worker_id);
    }
}
