<?php

declare(strict_types=1);

namespace Domain\Plans\Values;

use Domain\Tasks\Values\TaskWaitPair;

/**
 * What undoes an applied suggestion: the waits to add back and to remove again, valid only at the version it left.
 */
final readonly class PlanGraphUndo
{
    /**
     * @param  list<TaskWaitPair>  $added
     * @param  list<TaskWaitPair>  $removed
     */
    public function __construct(
        public string $version,
        public array $added,
        public array $removed,
    ) {}
}
