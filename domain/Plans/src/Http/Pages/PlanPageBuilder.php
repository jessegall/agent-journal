<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Pages;

use App\Reads\PageFormRequests;
use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Contracts\PageBuilder;
use Domain\Plans\Data\PlanCardData;
use Domain\Plans\Data\PlanFiltersData;
use Domain\Plans\Data\PlanReaderData;
use Domain\Plans\Http\Pages\Plans\PlansShow;
use Domain\Plans\Http\Requests\PlanRequest;
use Domain\Plans\Models\Plan;
use Domain\Plans\Resolvers\PlanResolver;
use Domain\Plans\Support\PlanGraphEditor;
use Domain\Plans\Support\PlanOutline;
use Domain\Plans\Support\PlanReviewView;
use Domain\Tasks\Contracts\TaskGraphResolver;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * One plan's record page, on its own route or open in the inspector: the plan read directly by its number, never
 * through the plans list, its paged outline only for the Tasks tab and its task graph only for the Graph tab. A plan
 * that cannot be read answers as not found, never as a failed window.
 */
final readonly class PlanPageBuilder implements PageBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private PlanResolver $records,
        private PlanOutline $outline,
        private PlanReviewView $review,
        private TaskGraphResolver $graphs,
        private PlansShow $page,
        private PlanGraphEditor $editing,
    ) {}

    public function build(Request $visit): PlanPageData
    {
        return PlanPageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): DeclaredLayoutData
    {
        $input = $this->requests->forVisit(PlanRequest::class, $visit);

        $plan = Plan::query()->findOr($input->planId(), fn () => throw new NotFoundHttpException());
        $planCard = $this->records->cardOf($plan);
        $card = PlanCardData::fromPlanCard($planCard);
        $number = $card->number;

        return $this->page->of(
            PlanFiltersData::from([...$input->filters()->toArray(), 'plan' => $number]),
            $card,
            $input->chosenTab(),
            fn () => PlanReaderData::forPlan(
                $planCard,
                $plan->brief,
                $this->outline->of($plan->id, $planCard->currentPhase, $input->outlinePageAsk()),
                $this->review->of($plan->id),
            ),
            fn () => $this->editing->offered($this->graphs->graphOf(
                $plan->id,
                $plan->taskIds(),
                $input->selectedNode(),
                route('plans.plan', ['plan' => $number, 'tab' => 'graph'], false),
            ), $number),
        );
    }
}
