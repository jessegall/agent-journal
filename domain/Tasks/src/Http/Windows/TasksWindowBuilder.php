<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Windows;

use App\Reads\PageFormRequests;
use App\Web\Creation\Contracts\WindowBuilder;
use App\Web\Creation\SurfaceAttributeMap;
use Domain\Tasks\Contracts\TaskListResolver;
use Domain\Tasks\Data\TasksPaneData;
use Domain\Tasks\Enums\TaskHolderFilter;
use Domain\Tasks\Http\Requests\TasksRequest;
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
        $filters = $this->requests->forVisit(TasksRequest::class, $visit)->filters();
        $policy = $this->policies->forType(TasksPaneData::class);
        $items = $this->tasks->preview($filters->toDomain(), $policy->limitFor('items'));

        $query = array_filter($filters->toArray(), fn (mixed $value) => $value !== null && $value !== 1);

        if ($filters->holder === TaskHolderFilter::Any) {
            unset($query['holder']);
        }

        return TasksPaneData::build()->items($items)->fullUrl(route('tasks.list', $query, false))->finish();
    }
}
