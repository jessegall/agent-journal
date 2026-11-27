<?php

declare(strict_types=1);

namespace Domain\Tasks\Values;

use App\Support\NumberedPage;
use Domain\Tasks\Enums\TaskHolderFilter;
use Domain\Tasks\Enums\TaskStatus;

/**
 * Which tasks to list: a title search, the states to keep (none means every state), who holds them, and the page.
 */
final readonly class TaskFilters
{
    /**
     * @param  list<TaskStatus>  $states
     * @param  list<string>  $environmentIds  the environments of the bindings tasks were made through; none for all
     */
    public function __construct(
        public string|null $search = null,
        public array $states = [],
        public NumberedPage $page = new NumberedPage(),
        public array $environmentIds = [],
        public TaskHolderFilter $holder = TaskHolderFilter::Any,
    ) {}
}
