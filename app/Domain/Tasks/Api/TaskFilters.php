<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Api;

use App\Core\Assignments\Support\NumberedPage;
use App\Domain\Tasks\Enums\TaskState;

/**
 * Which of the tasks the calling agent holds to list: a title search, the states to keep (none means every state) and
 * the page.
 */
final readonly class TaskFilters
{
    /**
     * @param  list<TaskState>  $states
     */
    public function __construct(
        public string $search = '',
        public array $states = [],
        public NumberedPage $page = new NumberedPage,
    ) {}
}
