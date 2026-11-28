<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Pages;

use App\CommandRules\Enums\ReadView;
use App\Reads\PageFormRequests;
use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Contracts\PageBuilder;
use Domain\Plans\Data\PlanFiltersData;
use Domain\Plans\Http\Pages\Plans\PlansTasksShow;
use Domain\Plans\Http\Requests\PlanTaskRequest;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Contracts\TaskVisibility;
use Domain\Tasks\Values\TaskSummary;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * A task of a plan opened inside the plan's own place: the task, the plan's filters and the way back to the plan with its
 * tab, page and node. A task that is not one of the plan's is not found.
 */
final readonly class PlanTaskPageBuilder implements PageBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private TaskDetailsResolver $tasks,
        private TaskVisibility $visible,
        private PlansTasksShow $page,
    ) {}

    public function build(Request $visit): PlanTaskPageData
    {
        return PlanTaskPageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): DeclaredLayoutData
    {
        $input = $this->requests->forVisit(PlanTaskRequest::class, $visit);

        $plan = Plan::query()->findOrFail($input->planId());
        $ids = $plan->taskIds();

        $position = array_find_key(
            $this->visible->summaries($ids),
            fn (TaskSummary $summary) => $summary->number === $input->taskNumber(),
        ) ?? throw new NotFoundHttpException();

        $taskId = $ids[$position];

        $task = $this->tasks->details($taskId, ReadView::Context);

        $back = route('plans.plan', ['plan' => $plan->number, ...$input->returnQuery()], false);

        return $this->page->of(
            PlanFiltersData::from([...$input->filters()->toArray(), 'plan' => (string) $plan->number]),
            $plan->number,
            $back,
            $task,
        );
    }
}
