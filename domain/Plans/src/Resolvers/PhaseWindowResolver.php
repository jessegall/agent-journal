<?php

declare(strict_types=1);

namespace Domain\Plans\Resolvers;

use App\Ui\Contracts\PageResolver;
use Domain\Plans\Data\PhaseReaderData;
use Domain\Plans\Http\Requests\PhaseRequest;
use Domain\Tasks\Contracts\TaskResolver;

/**
 * One phase's record page: the phase within its plan and its tasks by number.
 */
final readonly class PhaseWindowResolver implements PageResolver
{
    public function __construct(
        private PhaseRequest $request,
        private TaskResolver $tasks,
    ) {}

    public function read(): PhaseReaderData
    {
        $phase = $this->request->phase();

        return PhaseReaderData::from([
            'planNumber' => (string) $phase->plan->number,
            'planTitle' => $phase->plan->title,
            'number' => (string) $phase->number,
            'title' => $phase->title,
            'tasks' => $this->tasks->summaries($phase->taskIds()),
        ]);
    }
}
