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
use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Hooks\References\StateReference;
use App\Hooks\References\SubjectReference;
use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Tasks\Api\Events\TaskBlocked;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Api\TaskDetails;
use Domain\Tasks\Api\TaskCard;
use Domain\Tasks\Api\TaskExecution;
use Domain\Tasks\Api\TaskSummary;
use Domain\Tasks\Api\TaskType;
use Domain\Tasks\Database\Factories\TaskFactory;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Enums\TaskTextLimit;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Exceptions\CandidateLimitInvalid;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Exceptions\TaskRestartRefused;
use Domain\Tasks\Policies\TaskRunPolicy;
use Domain\Tasks\Support\TaskDetailsFactory;
use Domain\Tasks\Support\TaskWork;
use Illuminate\Contracts\Database\Query\Builder as QueryBuilder;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
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
 * @property-read string|null $stateText
 * @property string|null $block_reason
 * @property string|null $cancel_reason
 * @property string|null $environment_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[UseFactory(TaskFactory::class)]
#[UsePolicy(TaskRunPolicy::class)]
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
    'environment_id',
])]
final class Task extends Model implements Assignable, EventSource, Numbered, ReadableModel
{
    use AssignableListing;
    use BoundedReads;

    /**
     * @use HasFactory<TaskFactory>
     */
    use HasFactory;

    use HasNumber;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

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

    // ----------[ Constructors ]----------

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
     * A new open task an actor files, with its title and brief, in the environment of the connected binding it was
     * made through: none or one.
     *
     * @param  list<string>  $environmentIds
     */
    public static function create(string $title, string $brief, Actor $creator, array $environmentIds = []): self
    {
        return self::query()->create([
            'title' => $title,
            'brief' => $brief,
            'creator_type' => $creator->actorType(),
            'creator_id' => $creator->actorId(),
            'environment_id' => $environmentIds[0] ?? null,
        ]);
    }

    // ----------[ Queries ]----------

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
     * The task read under its row lock, for a change that must happen once.
     */
    public static function lockedById(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOr(fn () => throw TaskMissing::forId($id));
    }

    /**
     * The number the task with this id shows.
     */
    public static function numberOf(string $id): int
    {
        return (int) self::query()->whereKey($id)->readExactly(1)->value('number');
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

        $query = self::query()->where('state', TaskState::Open)->outsideSelectedIds($assignedIds);

        $ordered = match ($members->type) {
            PoolMembersType::All => $query->orderBy('id'),
            PoolMembersType::Ordered => $query->whereIn('id', $members->ids->ids)->inListedOrder($members->ids),
        };

        return new OrderedRecordIds(array_values($ordered->readExactly($limit)->pluck('id')->all()));
    }

    // ----------[ Mutations ]----------

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
     * Starts a new run for the actor, or keeps the run a started task already has, and announces it either way. An
     * ended task is not started again.
     *
     * @throws TaskRestartRefused
     */
    public function start(ActorIdentity $actor): void
    {
        if ($this->state->hasEnded()) {
            throw TaskRestartRefused::forTask($this->number, $this->state->value);
        }

        if ($this->state !== TaskState::Started) {
            $this->run_number++;
        }

        $previousState = $this->state;
        $this->state = TaskState::Started;
        $this->assertSaved($this->save());
        $this->raise(new TaskStarted($this->id, $actor, $previousState, (string) Str::ulid()));
    }

    public function finish(string $note): void
    {
        $previousState = $this->state;
        $this->state = TaskState::Finished;
        $this->result_note = $note;
        $this->assertSaved($this->save());
        $this->raise(new TaskFinished($this->id, $previousState, (string) Str::ulid()));
    }

    public function block(string $reason): void
    {
        $previousState = $this->state;
        $this->state = TaskState::Blocked;
        $this->block_reason = $reason;
        $this->assertSaved($this->save());
        $this->raise(new TaskBlocked($this->id, $previousState, (string) Str::ulid()));
    }

    public function cancel(string $reason): void
    {
        $previousState = $this->state;
        $this->state = TaskState::Cancelled;
        $this->cancel_reason = $reason;
        $this->assertSaved($this->save());
        $this->raise(new TaskCancelled($this->id, $previousState, (string) Str::ulid()));
    }

    // ----------[ Answers ]----------

    /**
     * The words the task's current state was entered with: the finish note, the block reason or the cancel reason;
     * none for an open or started task.
     *
     * @return Attribute<string|null, never>
     */
    protected function stateText(): Attribute
    {
        return Attribute::get(fn () => match ($this->state) {
            TaskState::Finished => $this->result_note,
            TaskState::Blocked => $this->block_reason,
            TaskState::Cancelled => $this->cancel_reason,
            TaskState::Open, TaskState::Started => null,
        });
    }

    public function isOpenForAssignment(): bool
    {
        return $this->state === TaskState::Open;
    }

    public function isCurrentRun(int $number): bool
    {
        return $number === $this->run_number;
    }

    /**
     * Who works on the task's latest run, with the runner's label when the caller may see it; it runs now while the
     * task is started and a claim on that run is live.
     */
    public function executionBy(ActorIdentity $runner, ActorLabelSet $labels, bool $isClaimed): TaskExecution
    {
        return new TaskExecution(
            $runner->type,
            $runner->id,
            $labels->nameOf($runner),
            $this->run_number,
            $this->state,
            $isClaimed && $this->state === TaskState::Started,
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
     * The task as a list shows it, with the holder and run its list read for the whole page.
     *
     * @param  Option<AssignmentHolder>  $holder
     */
    public function card(Option $holder, TaskExecution|null $execution): TaskCard
    {
        return new TaskCard($this->id, $this->number, $this->title, $this->state, $holder, $execution);
    }

    /**
     * The task as a read shows it, without its long texts.
     *
     * @param  Option<AssignmentHolder>  $holder
     */
    public function details(Option $holder, TaskExecution|null $execution): TaskDetails
    {
        return TaskDetailsFactory::details($this, $holder, $execution);
    }

    /**
     * The task as a read shows it, with its long texts.
     *
     * @param  Option<AssignmentHolder>  $holder
     */
    public function detailsWithText(Option $holder, TaskExecution|null $execution): TaskDetails
    {
        return TaskDetails::from([
            ...$this->details($holder, $execution)->all(),
            'text' => TaskDetailsFactory::text($this),
        ]);
    }

    // ----------[ Scopes ]----------

    /**
     * Tasks whose ids the subquery selects, such as the ids an actor holds.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function amongSelectedIds(Builder $query, QueryBuilder $ids): void
    {
        $query->whereIn('id', $ids);
    }

    /**
     * Tasks whose ids the subquery does not select, such as the ids anyone holds.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function outsideSelectedIds(Builder $query, QueryBuilder $ids): void
    {
        $query->whereNotIn('id', $ids);
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
     * Tasks made through a binding of one of these environments; no environment named leaves every task, those made
     * here as well.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $ids
     */
    #[Scope]
    protected function inEnvironments(Builder $query, array $ids): void
    {
        if ($ids === []) {
            return;
        }

        $query->whereIn('environment_id', $ids);
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
}
