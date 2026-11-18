<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp;

use App\Assignments\Support\NumberedPage;
use App\Mcp\Contracts\OverviewContribution;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\OverviewSection;
use Domain\Tasks\Api\TaskFilters;
use Domain\Tasks\Contracts\AssignedTaskReader;
use Domain\Tasks\Enums\TaskState;

/**
 * The tasks section of the caller's overview: how many unfinished tasks it holds, and the call that lists them.
 */
final readonly class HeldTasksOverview implements OverviewContribution
{
    public function __construct(private AssignedTaskReader $tasks) {}

    public function section(): string
    {
        return 'tasks';
    }

    public function read(): OverviewSection
    {
        $states = array_values(array_filter(TaskState::cases(), fn (TaskState $state): bool => ! $state->hasEnded()));
        $held = $this->tasks->assignedToCaller(new TaskFilters(states: $states, page: new NumberedPage(1, 1)))->total;
        $stateNames = array_map(fn (TaskState $state): string => $state->value, $states);

        return OverviewSection::from([
            'title' => 'Tasks you hold',
            'counts' => ['held' => $held],
            'nextAction' => new NextAction('tasks_assigned', ['states' => $stateNames]),
        ]);
    }
}
