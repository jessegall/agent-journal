<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Pages\Plans;

use App\Support\AssignmentData;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\PublicationTab;
use Closure;
use Domain\Plans\Data\PlanCardData;
use Domain\Plans\Data\PlanFiltersData;
use Domain\Plans\Data\PlanReaderData;
use Domain\Tasks\Data\TaskGraph;

/**
 * One plan's record page: the plans column with the plan in its reader, its label, state and facts, its Tasks tab the
 * paged outline with the plan's start and review, its Graph tab its tasks and their waits; only the opened tab is drawn.
 */
final readonly class PlansShow
{
    public function __construct(private PlansIndex $index) {}

    /**
     * @param  Closure(): PlanReaderData  $reader  reads the plan's outline and review, only when the Tasks tab is chosen
     * @param  Closure(): TaskGraph  $graph  reads the plan's task graph, only when its tab is chosen
     */
    public function of(
        PlanFiltersData $filters,
        PlanCardData $card,
        string $tab,
        Closure $reader,
        Closure $graph,
    ): DeclaredLayoutData {
        $detail = DetailPage::make($card->title)
            ->above(LayoutPartData::text('label', "Plan {$card->number} · {$this->percentOf($card)}%", 'code'))
            ->withFacts(...$this->factsOf($card))
            ->withTabs(
                PublicationTab::deferred(
                    'tasks',
                    'Tasks',
                    fn () => LayoutPartData::native('reader', LayoutNativeData::of('plans/PlanWindow', $reader())),
                ),
                PublicationTab::deferred(
                    'graph',
                    'Graph',
                    fn () => LayoutPartData::native('graph', LayoutNativeData::of('tasks/TaskGraph', $graph())),
                ),
            );

        return $this->index->of($filters, [$detail->part($tab)]);
    }

    private function percentOf(PlanCardData $card): int
    {
        return $card->totalTasks === 0 ? 0 : (int) round($card->finishedTasks / $card->totalTasks * 100);
    }

    /**
     * The plan's read-only facts: its state, how far its tasks are, its current phase and who holds it.
     *
     * @return list<LayoutRowData>
     */
    private function factsOf(PlanCardData $card): array
    {
        $rows = [
            LayoutRowData::from(['key' => 'state', 'label' => 'State', 'value' => $card->state->value]),
            LayoutRowData::from([
                'key' => 'tasks',
                'label' => 'Tasks',
                'value' => $card->totalTasks === 0
                    ? 'No tasks'
                    : "{$card->finishedTasks} of {$card->totalTasks} finished, {$card->cancelledTasks} cancelled",
            ]),
        ];

        if (is_string($card->phase)) {
            $rows[] = LayoutRowData::from(['key' => 'phase', 'label' => 'Current phase', 'value' => $card->phase]);
        }

        if ($card->holder instanceof AssignmentData) {
            $rows[] = LayoutRowData::from(['key' => 'holder', 'label' => 'Held by', 'value' => $card->holder->name]);
        }

        return $rows;
    }
}
