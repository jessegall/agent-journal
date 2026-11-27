<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use App\Support\NumberedPage;
use Domain\Tasks\Enums\TaskHolderFilter;
use Domain\Tasks\Enums\TaskStateGroup;
use Domain\Tasks\Values\TaskFilters;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The accepted filters of the tasks window as the browser keeps them in its query: search words, the open or the done
 * tasks or every task, who holds the tasks, the page, and the number of the task chosen to read.
 */
#[TypeScript]
final class TaskFiltersData extends Data
{
    public function __construct(
        #[MapName('q')]
        public readonly string|null $search = null,
        public readonly int $page = 1,
        public readonly TaskStateGroup|Optional $state = new Optional(),
        public readonly TaskHolderFilter $holder = TaskHolderFilter::Any,
        #[Regex('/^[1-9][0-9]{0,18}$/')]
        public readonly string|Optional $task = new Optional(),
    ) {}

    /**
     * The same filters on the page the list settled on, which may differ from the one asked for.
     */
    public function onPage(int $page): self
    {
        return self::from([...$this->toArray(), 'page' => $page]);
    }

    public function toDomain(): TaskFilters
    {
        return new TaskFilters(
            search: $this->search,
            states: $this->state instanceof Optional ? [] : $this->state->states(),
            page: new NumberedPage($this->page),
            holder: $this->holder,
        );
    }
}
