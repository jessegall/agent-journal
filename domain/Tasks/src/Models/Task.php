<?php

declare(strict_types=1);

namespace Domain\Tasks\Models;

use App\Actors\Contracts\Actor;
use App\Assignments\Contracts\Assignable;
use App\Assignments\Enums\PoolMembersType;
use App\Assignments\PoolMembers;
use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Models\Support\Accessor;
use App\Models\Support\AssignableListing;
use App\Models\Support\BelongsToProject;
use App\Models\Support\JournalModel;
use App\Projects\Contracts\ProjectOwned;
use App\Records\Contracts\Commentable;
use App\Records\Contracts\Numbered;
use App\Records\Contracts\ReadableModel;
use App\Stacks\Contracts\Work\Focusable;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;
use App\Support\ActorNames;
use App\Support\ActorReference;
use App\Support\AssignmentHolder;
use App\Support\OrderedRecordIds;
use App\Support\RecordIdentity;
use App\Values\ProjectOwner;
use Carbon\CarbonImmutable;
use Domain\Tasks\Data\TaskDetails;
use Domain\Tasks\Database\Factories\TaskFactory;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Enums\TaskTextLimit;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskDescribed;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Exceptions\CandidateLimitInvalid;
use Domain\Tasks\Exceptions\TaskChangedSinceRead;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Exceptions\TaskRestartRefused;
use Domain\Tasks\Policies\TaskRunPolicy;
use Domain\Tasks\Support\TaskDetailsFactory;
use Domain\Tasks\Values\TaskCard;
use Domain\Tasks\Values\TaskExecution;
use Domain\Tasks\Values\TaskSummary;
use Illuminate\Contracts\Database\Query\Builder as QueryBuilder;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * @property string $id
 * @property string $number_group_id
 * @property int $number
 * @property string $title
 * @property string $brief
 * @property string $creator_type
 * @property string $creator_id
 * @property int $revision
 * @property TaskStatus $status
 * @property int $run_number
 * @property string|null $result_note
 * @property string|null $block_reason
 * @property string|null $cancel_reason
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property string|null $environment_id
 * @property string $project_id
 * @property-read mixed $state_text
 * @property-read mixed $summary
 *
 * @method static \Domain\Tasks\Database\Factories\TaskFactory factory($count = null, $state = [])
 *
 * @mixin \Eloquent
 */
#[UseFactory(TaskFactory::class)]
#[UsePolicy(TaskRunPolicy::class)]
final class Task extends JournalModel implements
    Assignable,
    Commentable,
    EventSource,
    Focusable,
    Numbered,
    ProjectOwned,
    ReadableModel
{
    use AssignableListing;
    use BelongsToProject;
    use BoundedReads;

    /**
     * @use HasFactory<TaskFactory>
     */
    use HasFactory;

    use HasNumber;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

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
    protected $attributes = [
        'status' => 'open',
        'run_number' => 0,
        'revision' => 1,
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => TaskStatus::class,
            'revision' => 'integer',
            'run_number' => 'integer',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new open task an actor files, with its title and brief, in the environment of the connected binding it was
     * made through: none or one.
     *
     * @param  list<string>  $environmentIds
     */
    public static function create(
        string $title,
        string $brief,
        Actor $creator,
        ProjectOwner $owner,
        array $environmentIds = [],
    ): self {
        $task = new self();
        $task->title = $title;
        $task->brief = $brief;
        $task->creator_type = $creator->actorType();
        $task->creator_id = $creator->actorId();
        $task->project_id = $owner->projectId();
        $task->environment_id = $environmentIds[0] ?? null;
        $task->saveAndAssert();

        return $task;
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
        $this->saveAndAssert();
        $this->raise(new TaskDescribed($this->id));
    }

    /**
     * Starts a new run for the actor, or keeps the run a started task already has, and announces it either way. An
     * ended task is not started again.
     *
     * @throws TaskRestartRefused
     */
    public function start(ActorReference $actor): void
    {
        $this->assertNotEnded();

        if ($this->status !== TaskStatus::Started) {
            $this->run_number++;
        }

        $previousState = $this->status;
        $this->status = TaskStatus::Started;
        $this->saveAndAssert();
        $this->raise(new TaskStarted($this->id, $actor, $previousState, (string) Str::ulid()));
    }

    /**
     * The task is finished, with the note given.
     */
    public function finish(string $note): void
    {
        $previousState = $this->status;
        $this->status = TaskStatus::Finished;
        $this->result_note = $note;
        $this->saveAndAssert();
        $this->raise(new TaskFinished($this->id, $previousState, (string) Str::ulid()));
    }

    /**
     * The started task is blocked, for the reason given; a task in any other state changed since it was read.
     *
     * @throws TaskChangedSinceRead
     */
    public function block(string $reason): void
    {
        if ($this->status !== TaskStatus::Started) {
            throw TaskChangedSinceRead::notBlockable($this->number, $this->status);
        }

        $previousState = $this->status;
        $this->status = TaskStatus::Blocked;
        $this->block_reason = $reason;
        $this->saveAndAssert();
        $this->raise(new TaskBlocked($this->id, $previousState, (string) Str::ulid()));
    }

    /**
     * The task is cancelled, for the reason given.
     */
    public function cancel(string $reason): void
    {
        $previousState = $this->status;
        $this->status = TaskStatus::Cancelled;
        $this->cancel_reason = $reason;
        $this->saveAndAssert();
        $this->raise(new TaskCancelled($this->id, $previousState, (string) Str::ulid()));
    }

    /**
     * Holds the lock of the graph of waits of each environment, in order, to the end of the transaction; every change
     * of a wait and every fresh start takes it before any task row.
     *
     * @param  list<string>  $environments  '' for the tasks made here
     */
    public static function lockWaitGraphs(array $environments): void
    {
        $ordered = array_values(array_unique($environments));
        sort($ordered);

        foreach ($ordered as $environment) {
            self::query()->getConnection()->select('select pg_advisory_xact_lock(hashtext(?))', [
                "task-waits:{$environment}",
            ]);
        }
    }

    // ----------[ Predicates ]----------

    public function isOpenForAssignment(): bool
    {
        return $this->status === TaskStatus::Open;
    }

    public function isCurrentRun(int $number): bool
    {
        return $number === $this->run_number;
    }

    // ----------[ Transformers ]----------

    /**
     * Who works on the task's latest run, with the runner's label when the caller may see it, and the agent whose focus
     * the task is in; it runs now while the task is started and a claim on that run is live.
     *
     * @param  Option<ActorReference>  $focuser
     */
    public function executionBy(
        ActorReference $runner,
        ActorNames $labels,
        bool $isClaimed,
        Option $focuser,
    ): TaskExecution {
        return new TaskExecution(
            $runner->type,
            $runner->id,
            $labels->nameOf($runner),
            $this->run_number,
            $this->status,
            $isClaimed && $this->status === TaskStatus::Started,
            $focuser->map(fn (ActorReference $agent) => $labels->nameOf($agent) ?? "agent {$agent->id}"),
        );
    }

    public function assignmentIdentity(): RecordIdentity
    {
        return new RecordIdentity(self::linkType(), $this->id);
    }

    public function focusIdentity(): RecordIdentity
    {
        return $this->assignmentIdentity();
    }

    /**
     * The task as a list shows it, with the holder and run its list read for the whole page.
     *
     * @param  Option<AssignmentHolder>  $holder
     */
    public function card(Option $holder, TaskExecution|null $execution): TaskCard
    {
        return new TaskCard(
            $this->id,
            $this->number,
            $this->title,
            $this->status,
            $holder,
            $execution,
            $this->projectOwner(),
        );
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

    /**
     * The task's latest run, when it was ever started.
     */
    public function currentRun(): TaskRun|null
    {
        if ($this->run_number === 0) {
            return null;
        }

        return TaskRun::findForTask($this, $this->run_number);
    }

    // ----------[ Accessors ]----------

    /**
     * The task as a list shows it: its number and title.
     *
     * @return Attribute<TaskSummary, never>
     */
    protected function summary(): Attribute
    {
        return Accessor::get(function () {
            $changedAt = CarbonImmutable::parse((string) ($this->updated_at ?? $this->created_at));

            return new TaskSummary($this->number, $this->title, $this->status, $changedAt);
        });
    }

    /**
     * The words the task's current state was entered with: the finish note, the block reason or the cancel reason;
     * none for an open or started task.
     *
     * @return Attribute<string|null, never>
     */
    protected function stateText(): Attribute
    {
        return Accessor::get(fn () => match ($this->status) {
            TaskStatus::Finished => $this->result_note,
            TaskStatus::Blocked => $this->block_reason,
            TaskStatus::Cancelled => $this->cancel_reason,
            TaskStatus::Open, TaskStatus::Started => null,
        });
    }

    // ----------[ Asserts ]----------

    /**
     * @throws TaskChangedSinceRead when the task is not started
     */
    public function assertFocusable(): void
    {
        if ($this->status !== TaskStatus::Started) {
            throw TaskChangedSinceRead::notFocusable($this->number, $this->status);
        }
    }

    /**
     * Refuses to start a task that already ended.
     *
     * @throws TaskRestartRefused
     */
    private function assertNotEnded(): void
    {
        if ($this->status->hasEnded()) {
            throw TaskRestartRefused::forTask($this->number, $this->status->value);
        }
    }

    /**
     * Refuses a candidate limit below one or above what an ordered list of ids holds.
     *
     * @throws CandidateLimitInvalid
     */
    private static function assertCandidateLimit(int $limit): void
    {
        if ($limit < 1 || $limit > OrderedRecordIds::LARGEST) {
            throw CandidateLimitInvalid::for($limit, OrderedRecordIds::LARGEST);
        }
    }

    // ----------[ Queries ]----------

    /**
     * The summary of the task a task frame stands for; none when the frame names no task that exists.
     *
     * @return Option<TaskSummary>
     */
    public static function resolveSummaryOf(StateReference $frame): Option
    {
        if (! $frame->subject instanceof SubjectReference) {
            return None::create();
        }

        $task = self::query()->whereKey($frame->subject->id)->first();

        if ($task === null) {
            return None::create();
        }

        return new Some($task->summary);
    }

    /**
     * The task locked for a start: the graph of waits of its environment first, then its own row, so a start and a
     * change of its waits never check against each other's stale state.
     *
     * @throws TaskMissing
     */
    public static function findLockedForStart(string $id): self
    {
        self::lockWaitGraphs([(string) self::query()->whereKey($id)->value('environment_id')]);

        return self::findLockedById($id);
    }

    /**
     * The task with this id, unlocked; none is refused as missing.
     *
     * @throws TaskMissing
     */
    public static function findForId(string $id): self
    {
        return self::query()->whereKey($id)->firstOr(TaskMissing::throwing()->forId($id));
    }

    /**
     * The tasks with these ids, each with the columns a list of waits shows, by id; an id with no task is left out.
     *
     * @param  list<string>  $ids
     * @return array<string, self>
     */
    public static function findForIds(array $ids): array
    {
        if ($ids === []) {
            return [];
        }

        $unique = array_values(array_unique($ids));

        return self::query()->whereKey($unique)
            ->get(['id', 'number', 'title', 'status'])->keyBy('id')->all();
    }

    /**
     * The task read under its row lock, for a change that must happen once.
     */
    public static function findLockedById(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOr(TaskMissing::throwing()->forId($id));
    }

    /**
     * The number the task with this id shows.
     */
    public static function resolveNumberOf(string $id): int
    {
        return (int) self::query()->whereKey($id)->value('number');
    }

    /**
     * At most limit open tasks of the pool's members that nobody holds: every open task by id, or the listed ones in
     * their listed order. The filtering happens in the query, before its limit.
     *
     * @throws CandidateLimitInvalid
     */
    public static function resolveCandidates(
        PoolMembers $members,
        QueryBuilder $assignedIds,
        int $limit,
    ): OrderedRecordIds {
        self::assertCandidateLimit($limit);

        if ($members->type === PoolMembersType::Ordered && $members->ids->ids === []) {
            return new OrderedRecordIds([]);
        }

        $query = self::query()->open()->outsideSelectedIds($assignedIds)
            ->outsideSelectedIds(TaskWait::query()->unmetDependentIds());

        $ordered = match ($members->type) {
            PoolMembersType::All => $query->oldestFirst(),
            PoolMembersType::Ordered => $query->whereKey($members->ids->ids)->inListedOrder($members->ids),
        };

        return new OrderedRecordIds(array_values($ordered->limit($limit)->pluck('id')->all()));
    }

    // ----------[ Scopes ]----------

    /**
     * Tasks whose brief matches the LIKE pattern without regard to case, served by the brief trigram index.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function briefLike(Builder $query, string $pattern): void
    {
        $query->whereLike('brief', $pattern, caseSensitive: false);
    }

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
        $query->whereIn('status', TaskStatus::unfinished());
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

    /**
     * The open tasks.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function open(Builder $query): void
    {
        $query->where('status', TaskStatus::Open);
    }

    /**
     * The finished tasks.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function finished(Builder $query): void
    {
        $query->where('status', TaskStatus::Finished);
    }

    /**
     * The rows of the given title.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withTitle(Builder $query, string $title): void
    {
        $query->where('title', $title);
    }
}
