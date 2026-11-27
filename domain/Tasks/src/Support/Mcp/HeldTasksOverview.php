<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\Mcp;

use App\Mcp\Contracts\OverviewContribution;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\OverviewSection;
use App\Support\NumberedPage;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Values\TaskFilters;

/**
 * The tasks section of the caller's overview: how many unfinished tasks it holds, and the call that lists them.
 */
final readonly class HeldTasksOverview implements OverviewContribution
{
    public function __construct(private AssignedTaskResolver $tasks) {}

    public function section(): string
    {
        return 'tasks';
    }

    public function read(): OverviewSection
    {
        $states = array_values(
            array_filter(TaskStatus::cases(), fn (TaskStatus $status) => ! $status->hasEnded()),
        );

        $held = $this->tasks->assignedToCaller(new TaskFilters(states: $states, page: new NumberedPage(1, 1)))->total;
        $stateNames = array_map(fn (TaskStatus $status) => $status->value, $states);

        return OverviewSection::from([
            'title' => 'Tasks you hold',
            'counts' => ['held' => $held],
            'nextAction' => new NextAction('tasks_assigned', ['states' => $stateNames]),
        ]);
    }
}
