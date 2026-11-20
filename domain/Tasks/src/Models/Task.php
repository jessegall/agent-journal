<?php

declare(strict_types=1);

namespace Domain\Tasks\Models;

use App\Actors\Contracts\Actor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\ActorLabelSet;
use App\Assignments\Contracts\Assignable;
use App\Assignments\Enums\PoolMembersType;
use App\Assignments\Models\Support\AssignableListing;
use App\Assignments\Support\AssignmentHolder;
use App\Assignments\Support\OrderedRecordIds;
use App\Assignments\Support\PoolMembers;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Tasks\Api\TaskDetails;
use Domain\Tasks\Api\TaskExecution;
use Domain\Tasks\Api\TaskSummary;
use Domain\Tasks\Api\TaskType;
use Domain\Tasks\Database\Factories\TaskFactory;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Enums\TaskTextLimit;
use Domain\Tasks\Exceptions\CandidateLimitInvalid;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Exceptions\TaskRestartRefused;
use Domain\Tasks\Support\TaskWork;
use Illuminate\Contracts\Database\Query\Builder as QueryBuilder;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * One task. Each start begins a run; the agent and session working on it are set only by starting it.
 * Every agent reads every task, so it has no agent limit.
 *
 * @property string $id
 * @property string $number_group_id
 * @property int $number
 * @property string $title
 * @property string $brief
 * @property ActorType $creator_type
 * @property string $creator_id
 * @property int $revision
 * @property TaskState $state
 * @property int $run_number
 * @property string|null $result_note
 * @property string|null $block_reason
 * @property string|null $cancel_reason
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[UseFactory(TaskFactory::class)]
#[Fillable([
    'title',
    'brief',
    'creator_type',
    'creator_id',
    'revision',
    'run_number',
    'result_note',
    'block_reason',
    'cancel_reason',
])]
final class Task extends Model implements Assignable, Numbered, ReadableModel
{
    /**
     * @use HasFactory<TaskFactory>
     */
    use AssignableListing, HasFactory, HasNumber, HasUlids, Linkable;

    use BoundedReads;

    /**
     * The stable name links and assignments use for a task.
     */
    public const string LINK_TYPE = TaskType::VALUE;

    /**
     * The most characters a task's title holds.
     */
    public const int TITLE_CHARACTER_LIMIT = TaskTextLimit::Title->value;

    /**
     * The most characters a task's brief, result note, block reason or cancel reason holds.
     */
    public const int NOTE_CHARACTER_LIMIT = TaskTextLimit::Note->value;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = ['state' => 'open', 'run_number' => 0, 'revision' => 1];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => TaskState::class,
            'creator_type' => ActorType::class,
            'revision' => 'integer',
            'run_number' => 'integer',
        ];
    }

    /**
     * A new open task an actor files, with its title and brief.
     */
    public static function file(string $title, string $brief, Actor $creator): self
    {
        return self::query()->create([
            'title' => $title,
            'brief' => $brief,
            'creator_type' => $creator->actorType(),
            'creator_id' => $creator->actorId(),
        ]);
    }

    /**
     * The task read under its row lock, for a change that must happen once.
     */
    public static function lockedById(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOr(fn () => throw TaskMissing::forId($id));
    }

    /**
     * At most limit open tasks of the pool's members that nobody holds: every open task by id, or the listed ones in
     * their listed order. The filtering happens in the query, before its limit.
     *
     * @throws CandidateLimitInvalid
     */
    public static function candidates(PoolMembers $members, QueryBuilder $assignedIds, int $limit): OrderedRecordIds
    {
        if ($limit < 1 || $limit > OrderedRecordIds::LARGEST) {
            throw CandidateLimitInvalid::for($limit, OrderedRecordIds::LARGEST);
        }

        if ($members->type === PoolMembersType::Ordered && $members->ids->ids === []) {
            return new OrderedRecordIds([]);
        }

        $query = self::query()->where('state', TaskState::Open)->whereNotIn('id', $assignedIds);
        $ordered = match ($members->type) {
            PoolMembersType::All => $query->orderBy('id'),
            PoolMembersType::Ordered => $query->whereIn('id', $members->ids->ids)->inListedOrder($members->ids),
        };

        return new OrderedRecordIds(array_values($ordered->readLimit($limit)->pluck('id')->all()));
    }

    public function isOpenForAssignment(): bool
    {
        return $this->state === TaskState::Open;
    }

    /**
     * Tasks whose work is not over: open, started or blocked.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unfinished(Builder $query): void
    {
        $query->whereIn('state', TaskState::unfinished());
    }

    /**
     * Orders by each id's place in the list, with the ids passed as bindings.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inListedOrder(Builder $query, OrderedRecordIds $ids): void
    {
        $cases = $ids->ids
                |> count(...)
                |> (fn ($caseCount) => array_fill(0, $caseCount, 'when ? then cast(? as integer)'))
                |> (fn ($caseClauses) => implode(' ', $caseClauses));

        $bindings = [];

        foreach ($ids->ids as $position => $id) {
            array_push($bindings, $id, $position);
        }

        $query->orderByRaw("case id {$cases} end", $bindings);
    }

    /**
     * Starts a new run; a task that is already started keeps its run.
     */
    public function start(): void
    {
        if ($this->state !== TaskState::Started) {
            $this->run_number++;
        }

        $this->state = TaskState::Started;
        $this->save();
    }

    public function finish(): void
    {
        $this->state = TaskState::Finished;
        $this->save();
    }

    public function block(): void
    {
        $this->state = TaskState::Blocked;
        $this->save();
    }

    public function cancel(): void
    {
        $this->state = TaskState::Cancelled;
        $this->save();
    }

    /**
     * Gives the task a new title and brief, as a new revision.
     */
    public function describe(string $title, string $brief): void
    {
        $this->title = $title;
        $this->brief = $brief;
        $this->revision++;
        $this->save();
    }

    /**
     * Starts a new run, or keeps the run a started task already has. An ended task is not started again.
     *
     * @throws TaskRestartRefused
     */
    public function startRun(): void
    {
        if ($this->state->hasEnded()) {
            throw TaskRestartRefused::forTask($this->number, $this->state->value);
        }

        if ($this->state !== TaskState::Started) {
            $this->run_number++;
        }

        $this->state = TaskState::Started;
        $this->save();
    }

    public function finishRun(string $note): void
    {
        $this->state = TaskState::Finished;
        $this->result_note = $note;
        $this->save();
    }

    public function blockRun(string $reason): void
    {
        $this->state = TaskState::Blocked;
        $this->block_reason = $reason;
        $this->save();
    }

    public function cancelWith(string $reason): void
    {
        $this->state = TaskState::Cancelled;
        $this->cancel_reason = $reason;
        $this->save();
    }

    public function isCurrentRun(int $runNumber): bool
    {
        return $runNumber === $this->run_number;
    }

    /**
     * Who works on the task's latest run, with the runner's label when the caller may see it.
     */
    public function executionBy(ActorIdentity $runner, ActorLabelSet $labels): TaskExecution
    {
        return new TaskExecution(
            $runner->type,
            $runner->id,
            $labels->nameOf($runner),
            $this->run_number,
            $this->state,
        );
    }

    /**
     * The task's latest run, when it was ever started.
     */
    public function currentRun(): TaskRun|null
    {
        return $this->run_number === 0 ? null : TaskRun::ofTask($this, $this->run_number);
    }

    /**
     * The summary of the task a task frame stands for; none when the frame names no task that exists.
     *
     * @return Option<TaskSummary>
     */
    public static function summaryOf(StateReference $frame): Option
    {
        if (! $frame->subject instanceof SubjectReference) {
            return None::create();
        }

        $task = self::query()->whereKey($frame->subject->id)->first();

        return $task === null ? None::create() : new Some($task->summary());
    }

    /**
     * The task as a list shows it: its number and title.
     */
    public function summary(): TaskSummary
    {
        $changedAt = CarbonImmutable::parse((string) ($this->updated_at ?? $this->created_at));

        return new TaskSummary($this->number, $this->title, $this->state, $changedAt);
    }

    /**
     * What the stack sees of one run: the current run follows the task's state, an earlier run is over.
     */
    public function workFor(int $runNumber): TaskWork
    {
        return new TaskWork($this->number, $runNumber, $this->state, $runNumber === $this->run_number);
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }

    /**
     * The task as a read shows it; its long texts only when the read asks for them.
     *
     * @param  Option<AssignmentHolder>  $holder
     */
    public function details(Option $holder, TaskExecution|null $execution, bool $withText): TaskDetails
    {
        return new TaskDetails(
            $this->id,
            $this->number,
            $this->title,
            $this->state,
            $this->revision,
            $holder,
            $execution,
            $withText ? $this->brief : null,
            $withText ? $this->result_note : null,
            $withText ? $this->block_reason : null,
            $withText ? $this->cancel_reason : null,
        );
    }
}
