<?php

declare(strict_types=1);

namespace Domain\Plans\Resolvers;

use App\Reads\Enums\ReadView;
use App\Ui\Contracts\PageResolver;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\DetailPage;
use App\Ui\Layout\LayoutActionData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;
use Domain\Plans\Data\PlanFiltersData;
use Domain\Plans\Http\Requests\PlanTaskRequest;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanIndexLayout;
use Domain\Tasks\Api\TaskSummary;
use Domain\Tasks\Api\TaskText;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Contracts\TaskResolver;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * A task of a plan opened inside the plan's own place: the plans column stays beside it, and the reader leads with Back
 * to the plan, which carries the plan's tab, page and node so the way back finds them again. A task that is not one of
 * the plan's is not found.
 */
final readonly class PlanTaskWindowResolver implements PageResolver
{
    public function __construct(
        private PlanTaskRequest $request,
        private TaskDetailsResolver $tasks,
        private TaskResolver $visible,
        private PlanIndexLayout $index,
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

        $reader = DetailPage::make($task->title)
            ->above(LayoutPartData::action('back', "Back to plan {$plan->number}", LayoutActionData::to($back)))
            ->summarising($task->text instanceof TaskText ? $task->text->brief : '')
            ->withActions(LayoutPartData::action('open', 'Open task', LayoutActionData::to("/tasks/{$task->number}")))
            ->withFacts(
                new LayoutRowData('task', 'Task', (string) $task->number),
                new LayoutRowData('state', 'State', ucfirst($task->state->value)),
            );

        return $this->index->of(
            PlanFiltersData::from([...$this->request->filters()->toArray(), 'plan' => (string) $plan->number]),
            [$reader->part()],
        );
    }
}
