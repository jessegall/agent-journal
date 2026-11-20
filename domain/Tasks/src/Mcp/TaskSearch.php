<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp;

use App\Agents\Values\ReadRequest;
use App\Assignments\Support\NumberedPage;
use App\Mcp\Contracts\SearchContribution;
use App\Mcp\Data\SearchHit;
use App\Mcp\Data\SearchPage;
use Domain\Tasks\Api\TaskCard;
use Domain\Tasks\Api\TaskFilters;
use Domain\Tasks\Contracts\TaskListResolver;

final readonly class TaskSearch implements SearchContribution
{
    public function __construct(private TaskListResolver $tasks) {}

    public function recordType(): string
    {
        return 'tasks.task';
    }

    public function readRequest(): ReadRequest
    {
        return new ReadRequest('tasks_read');
    }

    public function search(string $query, int $page): SearchPage
    {
        $matches = $this->tasks->list(new TaskFilters(search: $query, page: new NumberedPage($page, self::PAGE_SIZE)));
        $hits = array_map(fn (TaskCard $task) => SearchHit::matching(
            $this->recordType(),
            $task->id,
            $task->title,
            $task->title,
            $query,
        ), $matches->cards);

        return new SearchPage($hits, $page * self::PAGE_SIZE < $matches->total);
    }
}
