<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Pages\Plans;

use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use Domain\Plans\Data\PlanFiltersData;
use Domain\Tasks\Data\TaskDetails;
use Domain\Tasks\Data\TaskText;

/**
 * A task of a plan opened inside the plan's own place: the plans column stays beside it, and the reader leads with Back
 * to the plan, which carries the plan's tab, page and node so the way back finds them again.
 */
final readonly class PlansTasksShow
{
    public function __construct(private PlansIndex $index) {}

    public function of(PlanFiltersData $filters, int $planNumber, string $back, TaskDetails $task): DeclaredLayoutData
    {
        $reader = DetailPage::make($task->title)
            ->above(LayoutPartData::action('back', "Back to plan {$planNumber}", LayoutActionData::to($back)))
            ->summarising($task->text instanceof TaskText ? $task->text->brief : '')
            ->withActions(LayoutPartData::action('open', 'Open task', LayoutActionData::to("/tasks/{$task->number}")))
            ->withFacts(
                new LayoutRowData('task', 'Task', (string) $task->number),
                new LayoutRowData('state', 'State', ucfirst($task->state->value)),
            );

        return $this->index->of($filters, [$reader->part()]);
    }
}
