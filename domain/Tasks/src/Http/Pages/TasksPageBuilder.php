<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Pages;

use App\Reads\PageFormRequests;
use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Contracts\PageBuilder;
use Domain\Tasks\Http\Pages\Tasks\TasksIndex;
use Domain\Tasks\Http\Requests\TasksRequest;
use Illuminate\Http\Request;

/**
 * The tasks window, on Home and on its own page: one page of tasks by its search, state and holder filters, on the
 * shared list recipe, with Nothing selected in its reader.
 */
final readonly class TasksPageBuilder implements PageBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private TasksIndex $index,
    ) {}

    public function build(Request $visit): TasksPageData
    {
        return TasksPageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): DeclaredLayoutData
    {
        $input = $this->requests->forVisit(TasksRequest::class, $visit);

        return $this->index->of($input->filters(), []);
    }
}
