<?php

declare(strict_types=1);

namespace App\Assignments\Support;

/**
 * One page of auto-assignments by ascending id, and the id the next page starts after, or null on the last page.
 */
final readonly class AutoAssignmentPage
{
    /**
     * @param  list<AutoAssignmentFact>  $facts
     */
    public function __construct(
        public array $facts,
        public string|null $nextAfterId,
    ) {}
}
