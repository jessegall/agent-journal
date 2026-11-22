<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Requests\Concerns;

use Domain\Tasks\Enums\TaskHolderFilter;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Http\Data\TaskFiltersData;
use Illuminate\Validation\Rule;

/**
 * The task list's query: search words, a state, who holds the tasks, the page, and the chosen task's number, read by
 * the list and by a reader that keeps the list beside it.
 */
trait ReadsTaskFilters
{
    /**
     * @return array<string, list<mixed>>
     */
    protected function filterRules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:200'],
            'page' => ['nullable', 'integer', 'min:1'],
            'state' => ['nullable', Rule::enum(TaskState::class)],
            'holder' => ['nullable', Rule::enum(TaskHolderFilter::class)],
            'task' => ['nullable', 'string', 'regex:/^[1-9][0-9]{0,18}$/'],
        ];
    }

    /**
     * An empty search arrives as null after Laravel's empty-string conversion; it means no search words.
     */
    public function filters(): TaskFiltersData
    {
        return TaskFiltersData::from(array_filter([
            'q' => $this->string('q')->toString(),
            'page' => $this->integer('page', 1),
            'state' => $this->enum('state', TaskState::class),
            'holder' => $this->enum('holder', TaskHolderFilter::class),
            'task' => $this->filled('task') ? $this->string('task')->toString() : null,
        ], fn (mixed $filterValue) => $filterValue !== null));
    }
}
