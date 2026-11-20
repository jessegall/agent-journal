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
use Domain\Plans\Exceptions\TaskAlreadyInAPhase;
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
    use HasNumber, HasUlids, Linkable;

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
     * Puts tasks, named by id, at the end of this phase in the order given, with one insert. A task already in a
     * phase, or named twice, is refused before anything is written. It runs inside the caller's transaction.
     *
     * @param  list<string>  $ids
     */
    public function addTasks(array $ids): void
    {
        Plan::lockStructure($this->plan_id);
        $duplicateTaskIds = array_keys(array_filter(array_count_values($ids), fn (int $count) => $count > 1));
        $alreadyPlacedTaskId = PhaseTask::query()->whereIn('task_id', $ids)->value('task_id');

        if ($duplicateTaskIds !== [] || $alreadyPlacedTaskId !== null) {
            throw TaskAlreadyInAPhase::forTask((string) ($duplicateTaskIds[0] ?? $alreadyPlacedTaskId));
        }

        $next = PhaseTask::query()->where('phase_id', $this->id)->count() + 1;

        PhaseTask::query()->insert(array_map(
            fn (string $taskId, int $offset) => [
                'id' => new PhaseTask()->newUniqueId(),
                'phase_id' => $this->id,
                'task_id' => $taskId,
                'position' => $next + $offset,
            ],
            $ids,
            array_keys($ids),
        ));
    }

    /**
     * Adds the tasks only when the phase is still at the revision the caller read, and makes a new revision of it.
     *
     * @param  list<string>  $ids
     *
     * @throws PhaseRevisionChanged
     */
    public function addTasksAtRevision(int $expectedRevision, array $ids): void
    {
        Plan::lockStructure($this->plan_id);
        $this->refresh();

        if ($this->revision !== $expectedRevision) {
            throw PhaseRevisionChanged::for($this->number, $expectedRevision, $this->revision);
        }

        $this->addTasks($ids);
        $this->revision++;
        $this->save();
    }

    // ----------[ Answers ]----------

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
