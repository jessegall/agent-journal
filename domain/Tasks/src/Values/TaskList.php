<?php

declare(strict_types=1);

namespace Domain\Tasks\Values;

use App\Support\NumberedPage;

/**
 * One page of the tasks the calling agent holds, by id, and how many it holds that match.
 */
final readonly class TaskList
{
    /**
     * @param  list<TaskCard>  $cards
     */
    public function __construct(
        public array $cards,
        public NumberedPage $page,
        public int $total,
    ) {}
}
