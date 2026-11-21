<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Assignments\Contracts\Assignable;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;
use Domain\Plans\Api\PhaseDetails;
use Domain\Plans\Api\PlanPhaseTasks;
use Domain\Plans\Exceptions\PhaseRevisionChanged;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * One phase of a plan, at its place in the plan, holding tasks in order. A task sits in one phase at most.
 *
 * @property string $id
 * @property string $plan_id
 * @property string $title
 * @property string $number_group_id
 * @property int $number
 * @property int $revision
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['title', 'revision'])]
final class Phase extends Model implements Assignable, Numbered, ReadableModel
{
    use BoundedReads;
    use HasNumber;
    use HasUlids;
    use Linkable;

    /**
     * The stable name links and assignments use for a phase.
     */
    public const string LINK_TYPE = 'plans.phase';

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['number' => 'integer', 'revision' => 'integer'];
    }

    /**
     * The plan's next phase, numbered within it.
     */
    public static function create(Plan $plan, string $title): self
    {
        $phase = new self(['title' => $title]);
        $phase->plan_id = $plan->id;
        $phase->setRelation('plan', $plan);
        $phase->save();

        return $phase;
    }

    // ----------[ Queries ]----------

    /**
     * The phase with this number in the plan, counted within the plan; none is refused as unavailable.
     *
     * @throws RecordUnavailable
     */
    public static function numberedIn(string $planId, int $number): self
    {
        return self::query()->where('plan_id', $planId)->where('number', $number)->firstOr(
            fn () => throw RecordUnavailable::numbered('phase', $number),
        );
    }

    // ----------[ Mutations ]----------

    /**
     * The phase took new tasks: it moves to its next revision.
     */
    public function advanceRevision(): void
    {
        $this->revision++;
        $this->save();
    }

    // ----------[ Answers ]----------

    /**
     * Refuses a change made against a revision of the phase that is no longer current.
     *
     * @throws PhaseRevisionChanged
     */
    public function assertAtRevision(int $expectedRevision): void
    {
        if ($this->revision !== $expectedRevision) {
            throw PhaseRevisionChanged::for($this->number, $expectedRevision, $this->revision);
        }
    }

    /**
     * @return list<string>
     */
    public function taskIds(): array
    {
        return array_map(
            strval(...),
            array_values(
                PhaseTask::query()->where(
                    'phase_id',
                    $this->id,
                )->readAll('every task of the phase')->orderBy('position')->pluck('task_id')->all(),
            ),
        );
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }

    /**
     * A phase is numbered within its plan: plan 12's phase 2.
     */
    public function numberHolder(): Model
    {
        return $this->relationLoaded('plan') ? $this->plan : $this->plan()->sole();
    }

    /**
     * The phase as a read shows it, with every task in its order.
     */
    public function details(): PhaseDetails
    {
        return new PhaseDetails(
            $this->id,
            $this->plan_id,
            $this->number,
            $this->title,
            $this->revision,
            $this->taskIds(),
        );
    }

    /**
     * The phase in a plan read, with the window of its tasks that read shows.
     *
     * @param  list<string>  $ids
     */
    public function withTasks(array $ids): PlanPhaseTasks
    {
        return new PlanPhaseTasks($this->id, $this->number, $this->title, $this->revision, $ids);
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<Plan, $this>
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    // ----------[ Scopes ]----------

    /**
     * The phase that holds the task, if any.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function holdingTask(Builder $query, string $taskId): void
    {
        $query->whereIn('id', PhaseTask::query()->select('phase_id')->where('task_id', $taskId));
    }
}
