<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Reads\Enums\ReadView;
use App\Ui\Contracts\PageResolver;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Http\Data\TaskReaderData;
use Domain\Tasks\Http\Requests\TaskRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * One task's record page, on its own route or open in the inspector: the task by its number with its texts, its
 * holder and its run. A task the caller may not read answers as not found, so no earlier field stays on screen.
 */
final readonly class TaskWindowResolver implements PageResolver
{
    public function __construct(
        private TaskRequest $request,
        private TaskDetailsResolver $details,
    ) {}

    public function read(): TaskReaderData
    {
        try {
            return TaskReaderData::fromDetails($this->details->details($this->request->taskId(), ReadView::Context));
        } catch (TaskMissing $missing) {
            throw new NotFoundHttpException(previous: $missing);
        }
    }
}
