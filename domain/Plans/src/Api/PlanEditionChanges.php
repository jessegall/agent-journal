<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

/**
 * What differs between two editions of a plan's review, by task number: the tasks only the newer one holds, the tasks
 * only the older one held, and the tasks whose frozen title or brief changed; whether the comparison covered both
 * editions whole, and whether the plan's own text changed.
 */
final readonly class PlanEditionChanges
{
    /**
     * @param  list<int>  $added
     * @param  list<int>  $removed
     * @param  list<int>  $changed
     */
    public function __construct(
        public array $added,
        public array $removed,
        public array $changed,
        public bool $isPlanTextChanged,
        public bool $isWhole,
    ) {}
}
