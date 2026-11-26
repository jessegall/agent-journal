<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Pages\Resolvers;

use App\Contracts\Navigation\PageResolver;
use App\Enums\CommandRules\ReadView;
use App\Support\Layout\DeclaredLayoutData;
use Domain\Plans\Data\PlanFiltersData;
use Domain\Plans\Http\Pages\Plans\PlansTasksShow;
use Domain\Plans\Http\Requests\PlanTaskRequest;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Contracts\TaskResolver;
use Domain\Tasks\Values\TaskSummary;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * A task of a plan opened inside the plan's own place: the task, the plan's filters and the way back to the plan with its
 * tab, page and node. A task that is not one of the plan's is not found.
 */
final readonly class PlanTaskWindowResolver implements PageResolver
{
    public function __construct(
        private PlanTaskRequest $request,
        private TaskDetailsResolver $tasks,
        private TaskResolver $visible,
        private PlansTasksShow $page,
    ) {}

    public function read(): DeclaredLayoutData
    {
        $plan = Plan::query()->findOrFail($this->request->planId());
        $ids = $plan->taskIds();

        $position = array_find_key(
            $this->visible->summaries($ids),
            fn (TaskSummary $summary) => $summary->number === $this->request->taskNumber(),
        ) ?? throw new NotFoundHttpException();

        $taskId = $ids[$position];

        $task = $this->tasks->details($taskId, ReadView::Context);

        $back = route('plans.plan', ['plan' => $plan->number, ...$this->request->returnQuery()], false);

        return $this->page->of(
            PlanFiltersData::from([...$this->request->filters()->toArray(), 'plan' => (string) $plan->number]),
            $plan->number,
            $back,
            $task,
        );
    }
}
