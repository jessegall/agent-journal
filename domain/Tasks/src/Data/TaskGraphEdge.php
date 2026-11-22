<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One wait of a graph, drawn from the task that must finish to the task that waits for it, and whether it is met.
 */
#[TypeScript]
final class TaskGraphEdge extends Data
{
    public function __construct(
        public readonly string $prerequisiteId,
        public readonly string $dependentId,
        public readonly bool $isSatisfied,
    ) {}
}
