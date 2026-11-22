<?php

declare(strict_types=1);

namespace Domain\Plans\Resolvers;

use App\Assignments\Support\AssignmentData;
use App\Ui\Contracts\PageResolver;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutNativeData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;
use Domain\Plans\Api\PlanSelection;
use Domain\Plans\Data\PlanCardData;
use Domain\Plans\Data\PlanReaderData;
use Domain\Plans\Http\Requests\PlanRequest;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanOutline;
use Domain\Plans\Support\PlanReviewView;
use Spatie\LaravelData\Optional;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * One plan's record page, on its own route or open in the inspector: the plan read directly by its number, with its
 * brief and the page of its outline the reader asked for, never through the plans list. A plan that cannot be read
 * answers as not found, never as a failed window.
 */
final readonly class PlanWindowResolver implements PageResolver
{
    public function __construct(
        private PlanRequest $request,
        private PlanRecords $records,
        private PlanOutline $outline,
        private PlanReviewView $review,
    ) {}

    public function read(): DeclaredLayoutData
    {
        $plan = Plan::query()->find($this->request->planId()) ?? throw new NotFoundHttpException();
        $card = $this->records->cardOf($plan);

        $reader = PlanReaderData::ofSelection(
            PlanSelection::found($card, true, $plan->brief),
            $this->outline->of($plan->id, $card->currentPhase, $this->request->outlinePageAsk()),
            $this->review->of($plan->id),
        );

        if ($reader instanceof Optional) {
            throw new NotFoundHttpException();
        }

        return DeclaredLayoutData::of(LayoutPartData::box(
            'plan',
            'stack',
            LayoutPartData::box(
                'header',
                'header',
                LayoutPartData::text('title', $reader->card->title, 'heading'),
                LayoutPartData::box(
                    'metadata',
                    'row',
                    LayoutPartData::text('label', "plan {$reader->card->number}", 'code'),
                    LayoutPartData::text('state', $reader->card->state->value, 'muted'),
                ),
            ),
            $this->factsOf($reader->card),
            LayoutPartData::native('reader', LayoutNativeData::of('plans/PlanWindow', $reader)),
        ));
    }

    /**
     * The plan's read-only facts: its state, how far its tasks are, its current phase and who holds it.
     */
    private function factsOf(PlanCardData $card): LayoutPartData
    {
        $rows = [
            new LayoutRowData('state', 'State', $card->state->value),
            new LayoutRowData(
                'tasks',
                'Tasks',
                "{$card->finishedTasks} of {$card->totalTasks} finished, {$card->cancelledTasks} cancelled",
            ),
        ];

        if (is_string($card->phase)) {
            $rows[] = new LayoutRowData('phase', 'Current phase', $card->phase);
        }

        if ($card->holder instanceof AssignmentData) {
            $rows[] = new LayoutRowData('holder', 'Held by', $card->holder->name);
        }

        return LayoutPartData::collection('facts', 'facts', $rows);
    }
}
