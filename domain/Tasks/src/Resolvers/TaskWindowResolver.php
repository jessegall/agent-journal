<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Reads\Enums\ReadView;
use App\Ui\Contracts\PageResolver;
use App\Ui\Contracts\SlotSections;
use Domain\Tasks\Api\TaskProof;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Contracts\TaskProofResolver;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Http\Data\TaskLogsData;
use Domain\Tasks\Http\Data\TaskProofData;
use Domain\Tasks\Http\Data\TaskProofsData;
use Domain\Tasks\Http\Data\TaskReaderData;
use Domain\Tasks\Http\Requests\TaskRequest;
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

    public function __construct(
        private TaskRequest $request,
        private TaskDetailsResolver $details,
        private SlotSections $slots,
        private TaskStream $stream,
        private TaskProofResolver $proofs,
    ) {}

    public function read(): TaskReaderData
    {
        try {
            $taskId = $this->request->taskId();
            return TaskReaderData::fromDetails(
                $this->details->details($taskId, ReadView::Context),
                $this->slots->sectionsIn('tasks.task', 'inspector'),
                $this->logsOf($taskId),
                $this->proofsOf($taskId),
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
}
