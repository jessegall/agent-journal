<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp;

use App\Mcp\Contracts\NumberedPages;
use Domain\Tasks\Api\TaskFilters;
use Domain\Tasks\Api\TaskList;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name('tasks_assigned')]
#[Description('The tasks you hold, with their assignment references and current runs.')]
final class AssignedTasksTool extends TaskListTool
{
    public function __construct(NumberedPages $pages, private readonly AssignedTaskResolver $reader)
    {
        parent::__construct($pages);
    }

    protected function tasks(TaskFilters $filters): TaskList
    {
        return $this->reader->assignedToCaller($filters);
    }
}
