<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Pages;

use App\Access\Contracts\CurrentAuthorizer;
use App\Agents\Enums\AccessType;
use App\CommandRules\Enums\ReadView;
use App\Navigation\Contracts\SlotSections;
use App\Reads\PageFormRequests;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\DetailPage;
use App\Support\NumberedPage;
use App\Support\RecordIdentity;
use App\Web\Creation\Contracts\PageBuilder;
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
use Domain\Tasks\Enums\TaskStatus;
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
use Illuminate\Http\Request;
use Spatie\LaravelData\Optional;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * One task's record page, on its route or in the inspector: the tasks list with the task open in its reader, its texts,
 * holder and run, and its Waits, Logs and Proofs only when their tab is open. A task the caller may not read answers as
 * not found.
 */
final readonly class TaskPageBuilder implements PageBuilder
{
    public const int PROOFS_PER_PAGE = 30;

    private const int CHOICES = 10;

    public function __construct(
        private PageFormRequests $requests,
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

    public function build(Request $visit): TaskPageData
    {
        return TaskPageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): DeclaredLayoutData
    {
        $input = $this->requests->from(TaskRequest::class, $visit);

        try {
            $taskId = $input->taskId();

            $reader = TaskReaderData::fromDetails(
                $this->details->details($taskId, ReadView::Context),
                $this->actionsOf($taskId),
                $this->comments->list(new RecordIdentity(Task::linkType(), $taskId), $input->commentsPage()),
                $this->slots->sectionsIn('tasks.task', 'inspector'),
                $this->logsOf($input, $taskId),
                $this->proofsOf($input, $taskId),
                TaskWaitsData::ofWaits($this->waits->waitsOf($taskId)),
                $input->isAskingForWaits() ? $this->waitActionsOf($input, $taskId) : Optional::create(),
            );

            return $this->index->of(
                TaskFiltersData::from([...$input->filters()->toArray(), 'task' => $reader->number]),
                [$this->readerPage($input, $reader)->part($input->chosenTab())],
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
    private function readerPage(TaskRequest $input, TaskReaderData $reader): DetailPage
    {
        if (! $input->isAskingForPassage()) {
            return $this->layout->page($reader);
        }

        return $this->layout->pageAtPassage($reader, $input->passage());
    }

    private function logsOf(TaskRequest $input, string $taskId): TaskLogsData|Optional
    {
        if (! $input->isAskingForLogs()) {
            return Optional::create();
        }

        $before = $input->logsBefore();

        return TaskLogsData::from([
            'newest' => $this->stream->page($taskId, ''),
            'older' => $before === '' ? Optional::create() : $this->stream->page($taskId, $before),
            ...$this->selectedLineOf($input, $taskId),
        ]);
    }

    /**
     * The log line a search opened the Logs tab at: shown first when the task still has it, else marked gone, never
     * replaced by another line.
     *
     * @return array<string, mixed>
     */
    private function selectedLineOf(TaskRequest $input, string $taskId): array
    {
        if (! $input->isAskingForEntry()) {
            return [];
        }

        $entry = TaskLogEntry::query()->ofTask($taskId)->whereKey($input->entryId())->first();

        if (! $entry instanceof TaskLogEntry) {
            return ['isSelectedGone' => true];
        }

        return ['selected' => TaskStreamEntryData::ofLine($entry->line)];
    }

    private function proofsOf(TaskRequest $input, string $taskId): TaskProofsData|Optional
    {
        if (! $input->isAskingForProofs()) {
            return Optional::create();
        }

        $after = $input->proofsAfter();
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
    private function waitActionsOf(TaskRequest $input, string $taskId): TaskWaitActionsData
    {
        $task = Task::findForId($taskId);

        $allowed = $this->authorizer->filterActions(TaskPolicy::class, $task, [AccessType::Edit, AccessType::Admin]);

        $hasEnded = $task->status->hasEnded();
        $search = $input->prerequisiteSearch();

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
        $task = Task::findForId($taskId);

        $allowed = $this->authorizer->filterActions(
            TaskRunPolicy::class,
            $task,
            [AccessType::Create, AccessType::Edit],
        );

        $mayCreate = in_array(AccessType::Create, $allowed, true);
        $mayEditRun = in_array(AccessType::Edit, $allowed, true);
        $isWaiting = $this->waits->readyAmong([$task->id]) === [];

        $startReason = match (true) {
            $task->status->hasEnded() => "Task {$task->number} is {$task->status->value}.",
            $task->status === TaskStatus::Started => "Task {$task->number} is already being worked on.",
            $isWaiting => "Task {$task->number} waits for other tasks to finish.",
            ! $mayCreate => 'You may not start this task.',
            default => null,
        };

        return TaskActionsData::from(array_filter([
            'mayStart' => $startReason === null,
            'mayBlock' => $mayEditRun && $task->status === TaskStatus::Started,
            'mayCancel' => $mayEditRun && ! $task->status->hasEnded(),
            'runNumber' => $task->run_number,
            'startReason' => $startReason,
        ], fn (mixed $actionValue) => $actionValue !== null));
    }
}
