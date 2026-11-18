<?php

declare(strict_types=1);

namespace Domain\Tasks\Models;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Support\AgentLabel;
use App\Assignments\Contracts\Assignable;
use App\Assignments\Enums\PoolMembersType;
use App\Assignments\Models\Support\AssignableListing;
use App\Assignments\Support\OrderedRecordIds;
use App\Assignments\Support\PoolMembers;
use App\Hooks\Contracts\WorkedOnStack;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use Domain\Tasks\Api\TaskExecution;
use Domain\Tasks\Api\TaskType;
use Domain\Tasks\Api\TaskSummary;
use Domain\Tasks\Database\Factories\TaskFactory;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Enums\TaskWorkState;
use Domain\Tasks\Exceptions\CandidateLimitInvalid;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Exceptions\TaskNotOpenForAssignment;
use Domain\Tasks\Exceptions\TaskRestartRefused;
use Domain\Tasks\Exceptions\TaskRunNotYours;
use Domain\Tasks\Exceptions\TaskRunTaken;
use Domain\Tasks\Exceptions\TaskTextTooLong;
use Domain\Tasks\States\Support\WorkingOnTaskStateReference;
use Domain\Tasks\Support\TaskLimits;
use Domain\Tasks\Support\TaskWork;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;
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
 * @property ActorType|null $run_actor_type
 * @property string|null $run_actor_id
 * @property string|null $result_note
 * @property string|null $block_reason
 * @property string|null $cancel_reason
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'title',
    'brief',
    'creator_type',
    'creator_id',
    'revision',
    'run_number',
    'run_actor_type',
    'run_actor_id',
    'result_note',
    'block_reason',
    'cancel_reason',
])]
#[UseFactory(TaskFactory::class)]
final class Task extends Model implements Assignable, Numbered, ReadableModel, WorkedOnStack
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
            'run_actor_type' => ActorType::class,
            'revision' => 'integer',
            'run_number' => 'integer',
        ];
    }

    /**
     * The task read under its row lock, for a change that must happen once.
     */
    public static function lockedById(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->first() ?? throw TaskMissing::forId($id);
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

    /**
     * @throws TaskNotOpenForAssignment
     */
    public function requireOpenForAssignment(): void
    {
        if ($this->state !== TaskState::Open) {
            throw TaskNotOpenForAssignment::forTask($this->number, $this->state->value);
        }
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
        $cases = implode(' ', array_fill(0, count($ids->ids), 'when ? then cast(? as integer)'));
        $bindings = [];

        foreach ($ids->ids as $position => $id) {
            array_push($bindings, $id, $position);
        }

        $query->orderByRaw("case id {$cases} end", $bindings);
    }

    /**
     * The state a frame holds while this run of the task is worked on.
     */
    public function workState(): StateReference
    {
        return WorkingOnTaskStateReference::forTask($this);
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
     *
     * @throws TaskTextTooLong
     */
    public function describe(string $title, string $brief): void
    {
        TaskLimits::check($title, $brief);
        $this->title = $title;
        $this->brief = $brief;
        $this->revision++;
        $this->save();
    }

    /**
     * Starts a new run owned by the actor; a task already started by that actor keeps its run. An ended task is not
     * started again, and another actor's run is not taken.
     *
     * @throws TaskRestartRefused
     * @throws TaskRunTaken
     */
    public function startRun(ActorIdentity $actor): void
    {
        if ($this->state->hasEnded()) {
            throw TaskRestartRefused::forTask($this->number, $this->state->value);
        }

        if ($this->state === TaskState::Started && ! $this->isRunOwnedBy($actor)) {
            throw TaskRunTaken::forTask($this->number);
        }

        if ($this->state !== TaskState::Started) {
            $this->run_number++;
        }

        $this->state = TaskState::Started;
        $this->run_actor_type = $actor->type;
        $this->run_actor_id = $actor->id;
        $this->save();
    }

    /**
     * @throws TaskTextTooLong
     */
    public function finishRun(string $note): void
    {
        TaskLimits::checkNote($note);
        $this->state = TaskState::Finished;
        $this->result_note = $note;
        $this->save();
    }

    /**
     * @throws TaskTextTooLong
     */
    public function blockRun(string $reason): void
    {
        TaskLimits::checkNote($reason);
        $this->state = TaskState::Blocked;
        $this->block_reason = $reason;
        $this->save();
    }

    /**
     * @throws TaskTextTooLong
     */
    public function cancelWith(string $reason): void
    {
        TaskLimits::checkNote($reason);
        $this->state = TaskState::Cancelled;
        $this->cancel_reason = $reason;
        $this->save();
    }

    /**
     * Refuses a run number that is not the task's current run, or an actor that does not own it; a caller who may act
     * on any run (the user) names the run only.
     *
     * @throws TaskRunNotYours
     */
    public function requireRun(int $runNumber, ActorIdentity|null $owner): void
    {
        if ($runNumber !== $this->run_number || ($owner !== null && ! $this->isRunOwnedBy($owner))) {
            throw TaskRunNotYours::forRun($this->number, $runNumber);
        }
    }

    /**
     * Who works on the task's latest run, with the agent's label when the caller may see it; null before any run.
     *
     * @param  array<string, AgentLabel>  $labels  keyed by agent id
     */
    public function executionWith(array $labels): TaskExecution|null
    {
        if ($this->run_actor_type === null || $this->run_actor_id === null) {
            return null;
        }

        $label = $labels[$this->run_actor_id] ?? null;

        return new TaskExecution(
            $this->run_actor_type,
            $this->run_actor_id,
            $label?->name,
            $this->run_number,
            $this->state->workState(),
        );
    }

    public function isRunOwnedBy(ActorIdentity $actor): bool
    {
        return $this->run_actor_type === $actor->type && $this->run_actor_id === $actor->id;
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
        return new TaskSummary($this->number, $this->title, $this->state);
    }

    /**
     * What the stack sees of one run: the current run follows the task's state, an earlier run is over.
     */
    public function workFor(int $runNumber): TaskWork
    {
        if ($runNumber !== $this->run_number) {
            return new TaskWork($this->number, $runNumber, TaskWorkState::Finished);
        }

        return new TaskWork($this->number, $runNumber, $this->state->workState());
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::LINK_TYPE, $this->id);
    }
}
