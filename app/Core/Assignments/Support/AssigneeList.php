<?php

declare(strict_types=1);

namespace App\Core\Assignments\Support;

/**
 * One page of the actors a record may be given to, and where the next page starts, or null on the last page.
 */
final readonly class AssigneeList
{
    /**
     * @param  list<AssigneeName>  $assignees
     */
    public function __construct(
        public array $assignees,
        public int|null $nextAfterId,
    ) {}
}
