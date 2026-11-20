<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Contracts\NumberedPages;
use Domain\Tasks\Api\TaskFilters;
use Domain\Tasks\Api\TaskList;
use Domain\Tasks\Contracts\TaskListResolver;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name('tasks_list')]
#[Description('List visible tasks by title or state, 20 at a time by default.')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
final class TasksListTool extends TaskListTool
{
    public function __construct(NumberedPages $pages, private readonly TaskListResolver $reader)
    {
        parent::__construct($pages);
    }

    protected function tasks(TaskFilters $filters): TaskList
    {
        return $this->reader->list($filters);
    }
}
