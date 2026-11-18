<?php

declare(strict_types=1);

namespace Domain\Plans\Readers;

use App\Ui\Contracts\PageReader;
use Domain\Plans\Data\PhaseReaderData;
use Domain\Plans\Http\Requests\PhaseRequest;
use Domain\Tasks\Contracts\TaskReader;

/**
 * One phase's record page: the phase within its plan and its tasks by number.
 */
final readonly class PhaseWindowReader implements PageReader
{
    public function __construct(
        private PhaseRequest $request,
        private TaskReader $tasks,
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
