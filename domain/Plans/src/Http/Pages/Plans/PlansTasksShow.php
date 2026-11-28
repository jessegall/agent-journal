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
final readonly class PlansTasksShow extends PlansPage
{
    public function __construct(private PlansIndex $index) {}

    public function of(PlanFiltersData $filters, int $number, string $back, TaskDetails $task): DeclaredLayoutData
    {
        $reader = DetailPage::make($task->title)
            ->above(LayoutPartData::build()
                ->asAction()
                ->key('back')
                ->label("Back to plan {$number}")
                ->action(LayoutActionData::build()->href($back)->finish())
                ->finish())
            ->summarising($task->text instanceof TaskText ? $task->text->brief : '')
            ->withActions(LayoutPartData::build()
                ->asAction()
                ->key('open')
                ->label('Open task')
                ->action(LayoutActionData::build()->href("/tasks/{$task->number}")->finish())
                ->finish())
            ->withFacts(
                LayoutRowData::build()->key('task')->label('Task')->value((string) $task->number)->finish(),
                LayoutRowData::build()
                    ->key('state')
                    ->label('State')
                    ->value(ucfirst($task->status->value))
                    ->finish(),
            );

        return $this->index->of($filters, [$reader->part()]);
    }
}
