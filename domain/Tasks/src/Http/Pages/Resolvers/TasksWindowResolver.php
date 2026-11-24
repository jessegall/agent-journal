<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Pages\Resolvers;

use App\Contracts\Navigation\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use Domain\Tasks\Http\Pages\Tasks\TasksIndex;
use Domain\Tasks\Http\Requests\TasksRequest;

/**
 * The tasks window, on Home and on its own page: one page of tasks by its search, state and holder filters, on the
 * shared list recipe, with Nothing selected in its reader.
 */
final readonly class TasksWindowResolver implements PageResolver
{
    public function __construct(
        private TasksRequest $request,
        private TasksIndex $index,
    ) {}

    public function read(): DeclaredLayoutData
    {
        return $this->index->of($this->request->filters(), []);
    }
}
