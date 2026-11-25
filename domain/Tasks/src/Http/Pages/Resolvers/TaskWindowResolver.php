<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Pages\Resolvers;

use App\Contracts\Authorization\CurrentAuthorizer;
use App\Contracts\Navigation\PageResolver;
use App\Contracts\Navigation\SlotSections;
use App\Enums\Agents\AccessType;
use App\Enums\CommandRules\ReadView;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\DetailPage;
use App\Support\NumberedPage;
use App\Support\RecordIdentity;
use Domain\Comments\Contracts\CommentResolver;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Contracts\TaskListResolver;
use Domain\Tasks\Contracts\TaskProofResolver;
use Domain\Tasks\Contracts\TaskWaitResolver;
use Domain\Tasks\Data\TaskActionsData;
use Domain\Tasks\Data\TaskFiltersData;
use Domain\Tasks\Data\TaskLogsData;
use Domain\Tasks\Data\TaskProofsData;
use Domain\Tasks\Data\TaskReaderData;
use Domain\Tasks\Data\TaskStreamEntryData;
use Domain\Tasks\Data\TaskWaitActionsData;
use Domain\Tasks\Data\TaskWaitChoiceData;
use Domain\Tasks\Data\TaskWaitsData;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Exceptions\TaskPassageUnavailable;
use Domain\Tasks\Http\Pages\Tasks\TasksIndex;
use Domain\Tasks\Http\Pages\Tasks\TasksShow;
use Domain\Tasks\Http\Requests\TaskRequest;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskLogEntry;
use Domain\Tasks\Policies\TaskPolicy;
use Domain\Tasks\Policies\TaskRunPolicy;
use Domain\Tasks\Support\TaskStream;
use Domain\Tasks\Values\TaskCard;
use Domain\Tasks\Values\TaskFilters;
use Spatie\LaravelData\Optional;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * One task's record page, on its own route or open in the inspector: the tasks list with the task by its number
 * open in its reader, with its texts, its holder and its run; its Waits, Logs and Proofs only when the reader opened
 * their tab, a bounded page each. A task the caller may not read answers as not found, so no earlier field stays on
 * screen.
 */
final readonly class TaskWindowResolver implements PageResolver
{
    public const int PROOFS_PER_PAGE = 30;

    private const int CHOICES = 10;

    public function __construct(
        private TaskRequest $request,
        private TaskDetailsResolver $details,
        private SlotSections $slots,
        private TaskStream $stream,
        private TaskProofResolver $proofs,
        private CommentResolver $comments,
        private TaskWaitResolver $waits,
        private CurrentAuthorizer $authorizer,
        private TaskListResolver $list,
        private TasksIndex $index,
        private TasksShow $layout,
    ) {}

    public function read(): DeclaredLayoutData
    {
        try {
            $taskId = $this->request->taskId();

            $reader = TaskReaderData::fromDetails(
                $this->details->details($taskId, ReadView::Context),
                $this->actionsOf($taskId),
                $this->comments->list(new RecordIdentity(Task::linkType(), $taskId), $this->request->commentsPage()),
                $this->slots->sectionsIn('tasks.task', 'inspector'),
                $this->logsOf($taskId),
                $this->proofsOf($taskId),
                TaskWaitsData::ofWaits($this->waits->waitsOf($taskId)),
                $this->request->isAskingForWaits() ? $this->waitActionsOf($taskId) : Optional::create(),
            );

            return $this->index->of(
                TaskFiltersData::from([
                    ...$this->request->filters()->toArray(),
                    'task' => $reader->number,
                ]),
                [$this->readerPage($reader)->part($this->request->chosenTab())],
            );
        } catch (TaskMissing|TaskPassageUnavailable $missing) {
            throw new NotFoundHttpException(previous: $missing);
        }
    }

    /**
     * The reader, opened at the brief passage a search found when the window names one.
     *
     * @throws TaskPassageUnavailable
     */
    private function readerPage(TaskReaderData $reader): DetailPage
    {
        if (! $this->request->isAskingForPassage()) {
            return $this->layout->page($reader);
        }

        return $this->layout->pageAtPassage($reader, $this->request->passage());
    }

    private function logsOf(string $taskId): TaskLogsData|Optional
    {
        if (! $this->request->isAskingForLogs()) {
            return Optional::create();
        }

        $before = $this->request->logsBefore();

        return TaskLogsData::from([
            'newest' => $this->stream->page($taskId, ''),
            'older' => $before === '' ? Optional::create() : $this->stream->page($taskId, $before),
            ...$this->selectedLineOf($taskId),
        ]);
    }

    /**
     * The log line a search opened the Logs tab at: shown first when the task still has it, else marked gone, never
     * replaced by another line.
     *
     * @return array<string, mixed>
     */
    private function selectedLineOf(string $taskId): array
    {
        if (! $this->request->isAskingForEntry()) {
            return [];
        }

        $entry = TaskLogEntry::query()->ofTask($taskId)->whereKey($this->request->entryId())->first();

        if (! $entry instanceof TaskLogEntry) {
            return ['isSelectedGone' => true];
        }

        return ['selected' => TaskStreamEntryData::ofLine($entry->line)];
    }

    private function proofsOf(string $taskId): TaskProofsData|Optional
    {
        if (! $this->request->isAskingForProofs()) {
            return Optional::create();
        }

        $after = $this->request->proofsAfter();
        $page = $this->proofs->proofsOf($taskId, $after === '' ? null : $after, self::PROOFS_PER_PAGE);

        $fields = ['after' => $after, 'proofs' => $page->proofs];

        if ($page->nextAfter !== null) {
            $fields['nextAfter'] = $page->nextAfter;
        }

        return TaskProofsData::from($fields);
    }

    /**
     * What the caller may do with the task's waits: the task's own policy decides Edit (add, remove) and Admin
     * (waive); an ended task offers none, with the reason; a search lists at most ten other tasks.
     */
    private function waitActionsOf(string $taskId): TaskWaitActionsData
    {
        $task = Task::ofId($taskId);
        $allowed = $this->authorizer->filterActions(TaskPolicy::class, $task, [
            AccessType::Edit,
            AccessType::Admin,
        ]);
        $hasEnded = $task->state->hasEnded();
        $search = $this->request->prerequisiteSearch();

        $choices = $search === '' || $hasEnded ? [] : $this->list->list(
            new TaskFilters(search: $search, page: new NumberedPage(1, self::CHOICES)),
        )->cards;

        return TaskWaitActionsData::from([
            'mayEdit' => ! $hasEnded && in_array(AccessType::Edit, $allowed, true),
            'mayWaive' => ! $hasEnded && in_array(AccessType::Admin, $allowed, true),
            'choices' => array_values(array_map(
                fn (TaskCard $card) => TaskWaitChoiceData::ofCard($card),
                array_filter($choices, fn (TaskCard $card) => $card->id !== $taskId),
            )),
            'reason' => $hasEnded
                ? "Task {$task->number} has ended, so its waits no longer change."
                : Optional::create(),
        ]);
    }

    /**
     * What the caller may do with the task now: start it when the run policy lets them create a run, the task is open
     * or blocked and its waits are met; block its started run and cancel it while it has not ended when they hold the
     * run's edit; the reason when start is not offered.
     */
    private function actionsOf(string $taskId): TaskActionsData
    {
        $task = Task::ofId($taskId);

        $allowed = $this->authorizer->filterActions(
            TaskRunPolicy::class,
            $task,
            [
                AccessType::Create,
                AccessType::Edit,
            ],
        );

        $mayCreate = in_array(AccessType::Create, $allowed, true);
        $mayEditRun = in_array(AccessType::Edit, $allowed, true);
        $isWaiting = $this->waits->readyAmong([$task->id]) === [];

        $startReason = match (true) {
            $task->state->hasEnded() => "Task {$task->number} is {$task->state->value}.",
            $task->state === TaskState::Started => "Task {$task->number} is already being worked on.",
            $isWaiting => "Task {$task->number} waits for other tasks to finish.",
            ! $mayCreate => 'You may not start this task.',
            default => null,
        };

        return TaskActionsData::from(array_filter([
            'mayStart' => $startReason === null,
            'mayBlock' => $mayEditRun && $task->state === TaskState::Started,
            'mayCancel' => $mayEditRun && ! $task->state->hasEnded(),
            'runNumber' => $task->run_number,
            'startReason' => $startReason,
        ], fn (mixed $actionValue) => $actionValue !== null));
    }
}
