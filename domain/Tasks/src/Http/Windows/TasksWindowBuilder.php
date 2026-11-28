<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Windows;

use App\Reads\PageFormRequests;
use App\Support\Layout\LayoutRowData;
use App\Web\Creation\Contracts\WindowBuilder;
use App\Web\Creation\SurfaceAttributeMap;
use Domain\Tasks\Data\TasksPaneData;
use Domain\Tasks\Contracts\TaskListResolver;
use Domain\Tasks\Http\Requests\TasksRequest;
use Domain\Tasks\Models\Task;
use Illuminate\Http\Request;

final readonly class TasksWindowBuilder implements WindowBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private SurfaceAttributeMap $policies,
        private TaskListResolver $tasks,
    ) {}

    public function build(Request $visit): TasksPaneData
    {
        $filters = $this->requests->from(TasksRequest::class, $visit)->filters();
        $policy = $this->policies->forType(TasksPaneData::class);
        $tasks = $this->tasks->preview($filters->toDomain(), $policy->limitFor('items'));
        $items = $tasks->map(fn (Task $task) => LayoutRowData::build()
            ->key($task->id)
            ->label($task->title)
            ->value($task->status->standingWord())
            ->finish())->values()->all();

        $query = array_filter($filters->toArray(), fn (mixed $value) => $value !== null && $value !== 1
            && $value !== \Domain\Tasks\Enums\TaskHolderFilter::Any->value);

        return TasksPaneData::build()->items($items)->fullUrl(route('tasks.list', $query, false))->finish();
    }
}
