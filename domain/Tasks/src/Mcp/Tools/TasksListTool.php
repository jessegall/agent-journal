<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp\Tools;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Contracts\NumberedPages;
use App\Mcp\Enums\DiscoveryProfile;
use Domain\Tasks\Contracts\TaskListResolver;
use Domain\Tasks\Values\TaskFilters;
use Domain\Tasks\Values\TaskList;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name('tasks_list')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('List visible tasks by title or state, 20 at a time by default.')]
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
