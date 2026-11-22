<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp\Tools;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Contracts\NumberedPages;
use App\Mcp\Enums\DiscoveryProfile;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Values\TaskFilters;
use Domain\Tasks\Values\TaskList;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name('tasks_assigned')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper)]
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
