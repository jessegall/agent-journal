<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Ui\Contracts\PageResolver;
use Domain\Tasks\Contracts\TaskListResolver;
use Domain\Tasks\Http\Data\TaskListData;
use Domain\Tasks\Http\Data\TaskRowData;
use Domain\Tasks\Http\Requests\TasksRequest;

/**
 * The tasks window, on Home and on its own page: one page of tasks by its search, state and holder filters.
 */
final readonly class TasksWindowResolver implements PageResolver
{
    public function __construct(
        private TasksRequest $request,
        private TaskListResolver $tasks,
    ) {}

    public function read(): TaskListData
    {
        $filters = $this->request->filters();
        $taskPage = $this->tasks->list($filters->toDomain());

        return TaskListData::from([
            'rows' => TaskRowData::collect($taskPage->cards),
            'filters' => $filters->onPage($taskPage->page->number),
            'pagination' => [
                'page' => $taskPage->page->number,
                'lastPage' => max(1, (int) ceil($taskPage->total / $taskPage->page->size)),
                'total' => $taskPage->total,
            ],
        ]);
    }
}
