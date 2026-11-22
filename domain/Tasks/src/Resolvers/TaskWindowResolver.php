<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Assignments\Support\NumberedPage;
use App\Comments\Contracts\CommentResolver;
use App\Operations\Enums\AccessType;
use App\Reads\Enums\ReadView;
use App\Records\Support\RecordIdentity;
use App\Ui\Contracts\PageResolver;
use App\Ui\Contracts\SlotSections;
use Domain\Tasks\Api\TaskCard;
use Domain\Tasks\Api\TaskFilters;
use Domain\Tasks\Api\TaskProof;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Contracts\TaskListResolver;
use Domain\Tasks\Contracts\TaskProofResolver;
use Domain\Tasks\Contracts\TaskWaitResolver;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Http\Data\TaskLogsData;
use Domain\Tasks\Http\Data\TaskProofData;
use Domain\Tasks\Http\Data\TaskProofsData;
use Domain\Tasks\Http\Data\TaskReaderData;
use Domain\Tasks\Http\Data\TaskWaitActionsData;
use Domain\Tasks\Http\Data\TaskWaitChoiceData;
use Domain\Tasks\Http\Data\TaskWaitsData;
use Domain\Tasks\Http\Requests\TaskRequest;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;
use Domain\Tasks\Support\TaskStream;
use Spatie\LaravelData\Optional;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * One task's record page, on its own route or open in the inspector: the task by its number with its texts, its
 * holder and its run, and the sections other domains add beside its facts, such as its plan; its Logs and Proofs only
 * when the reader opened their tab, a bounded page each. A task the caller may not read answers as not found, so no
 * earlier field stays on screen.
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
    ) {}

    public function read(): TaskReaderData
    {
        try {
            $taskId = $this->request->taskId();
            return TaskReaderData::fromDetails(
                $this->details->details($taskId, ReadView::Context),
                $this->comments->list(new RecordIdentity(Task::LINK_TYPE, $taskId), $this->request->commentsPage()),
                $this->slots->sectionsIn('tasks.task', 'inspector'),
                $this->logsOf($taskId),
                $this->proofsOf($taskId),
                $this->request->asksForWaits()
                    ? TaskWaitsData::ofWaits($this->waits->waitsOf($taskId))
                    : Optional::create(),
                $this->request->asksForWaits() ? $this->waitActionsOf($taskId) : Optional::create(),
            );
        } catch (TaskMissing $missing) {
            throw new NotFoundHttpException(previous: $missing);
        }
    }

    private function logsOf(string $taskId): TaskLogsData|Optional
    {
        if (! $this->request->asksForLogs()) {
            return Optional::create();
        }

        $before = $this->request->logsBefore();

        return TaskLogsData::from([
            'newest' => $this->stream->page($taskId, ''),
            'older' => $before === '' ? Optional::create() : $this->stream->page($taskId, $before),
        ]);
    }

    private function proofsOf(string $taskId): TaskProofsData|Optional
    {
        if (! $this->request->asksForProofs()) {
            return Optional::create();
        }

        $after = $this->request->proofsAfter();
        $page = $this->proofs->proofsOf($taskId, $after === '' ? null : $after, self::PROOFS_PER_PAGE);

        return TaskProofsData::from([
            'after' => $after,
            'proofs' => array_map(fn (TaskProof $proof) => TaskProofData::ofProof($proof), $page->proofs),
            'nextAfter' => $page->nextAfter ?? Optional::create(),
        ]);
    }

    /**
     * What the caller may do with the task's waits: the task's own policy decides Edit (add, remove) and Admin
     * (waive); an ended task offers none, with the reason; a search lists at most ten other tasks.
     */
    private function waitActionsOf(string $taskId): TaskWaitActionsData
    {
        $task = Task::ofId($taskId);
        $allowed = $this->authorizer->filterActions(TaskPolicy::class, $task, [AccessType::Edit, AccessType::Admin]);
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
}
