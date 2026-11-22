<?php

declare(strict_types=1);

namespace Domain\Plans\Resolvers;

use App\Assignments\Support\AssignmentData;
use App\Ui\Contracts\PageResolver;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\DetailPage;
use App\Ui\Layout\LayoutNativeData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;
use App\Ui\Layout\PublicationTab;
use Domain\Plans\Api\PlanSelection;
use Domain\Plans\Data\PlanCardData;
use Domain\Plans\Data\PlanFiltersData;
use Domain\Plans\Data\PlanReaderData;
use Domain\Plans\Http\Requests\PlanRequest;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanIndexLayout;
use Domain\Plans\Support\PlanOutline;
use Domain\Plans\Support\PlanReviewView;
use Domain\Tasks\Contracts\TaskGraphResolver;
use Spatie\LaravelData\Optional;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * One plan's record page, on its own route or open in the inspector: the plans column with the plan read directly by
 * its number in its reader, never through the plans list. Its Tasks tab is the paged outline with the plan's start and
 * review, its Graph tab its tasks and their waits; only the opened tab is read. A plan that cannot be read answers as
 * not found, never as a failed window.
 */
final readonly class PlanWindowResolver implements PageResolver
{
    public function __construct(
        private PlanRequest $request,
        private PlanRecords $records,
        private PlanOutline $outline,
        private PlanReviewView $review,
        private TaskGraphResolver $graphs,
        private PlanIndexLayout $index,
    ) {}

    public function read(): DeclaredLayoutData
    {
        $plan = Plan::query()->find($this->request->planId()) ?? throw new NotFoundHttpException();
        $card = $this->records->cardOf($plan);
        $tab = $this->request->chosenTab();

        $reader = PlanReaderData::ofSelection(
            PlanSelection::found($card, true, $plan->brief),
            $tab === 'tasks'
                ? $this->outline->of($plan->id, $card->currentPhase, $this->request->outlinePageAsk())
                : Optional::create(),
            $this->review->of($plan->id),
        );

        if ($reader instanceof Optional) {
            throw new NotFoundHttpException();
        }

        $detail = DetailPage::make($reader->card->title)
            ->above(
                LayoutPartData::text('label', "plan {$reader->card->number}", 'code'),
                LayoutPartData::text('state', $reader->card->state->value, 'muted'),
            )
            ->withFacts(...$this->factsOf($reader->card))
            ->withTabs(
                PublicationTab::deferred(
                    'tasks',
                    'Tasks',
                    fn () => LayoutPartData::native('reader', LayoutNativeData::of('plans/PlanWindow', $reader)),
                ),
                PublicationTab::deferred('graph', 'Graph', fn () => $this->graphOf($plan, $reader->card->number)),
            );

        return $this->index->of(
            PlanFiltersData::from([...$this->request->filters()->toArray(), 'plan' => $reader->card->number]),
            [$detail->part($tab)],
        );
    }

    private function graphOf(Plan $plan, string $number): LayoutPartData
    {
        $address = route('plans.plan', ['plan' => $number, 'tab' => 'graph'], false);
        $graph = $this->graphs->graphOf($plan->id, $plan->taskIds(), $this->request->selectedNode(), $address);

        return LayoutPartData::native('graph', LayoutNativeData::of('tasks/TaskGraph', $graph));
    }

    /**
     * The plan's read-only facts: its state, how far its tasks are, its current phase and who holds it.
     *
     * @return list<LayoutRowData>
     */
    private function factsOf(PlanCardData $card): array
    {
        $rows = [
            new LayoutRowData('state', 'State', $card->state->value),
            new LayoutRowData(
                'tasks',
                'Tasks',
                $card->totalTasks === 0
                    ? 'No tasks'
                    : "{$card->finishedTasks} of {$card->totalTasks} finished, {$card->cancelledTasks} cancelled",
            ),
        ];

        if (is_string($card->phase)) {
            $rows[] = new LayoutRowData('phase', 'Current phase', $card->phase);
        }

        if ($card->holder instanceof AssignmentData) {
            $rows[] = new LayoutRowData('holder', 'Held by', $card->holder->name);
        }

        return $rows;
    }
}
