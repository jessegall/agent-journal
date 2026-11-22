<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Waits a plan service proposes for the same tasks, with the version of the graph it was made from, so applying it can
 * be refused when the waits changed meanwhile.
 */
#[TypeScript]
final class TaskGraphSuggestion extends Data
{
    /**
     * @param  list<TaskGraphEdge>  $edges
     */
    public function __construct(
        public readonly string $baseVersion,
        #[DataCollectionOf(TaskGraphEdge::class)]
        public readonly array $edges,
    ) {}
}
