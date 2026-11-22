<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The tasks of one plan and the waits among them as a graph reader draws them: the plan, a version that changes when
 * any task state or wait does, the nodes and edges, the selected task when one is chosen, and the address a task opens
 * back to, which restores the selected node. A suggestion and the addresses its steps are sent to are there only when
 * a service gives them.
 */
#[TypeScript]
final class TaskGraph extends Data
{
    /**
     * @param  list<TaskGraphNode>  $nodes
     * @param  list<TaskGraphEdge>  $edges
     */
    public function __construct(
        public readonly string $planId,
        public readonly string $version,
        #[DataCollectionOf(TaskGraphNode::class)]
        public readonly array $nodes,
        #[DataCollectionOf(TaskGraphEdge::class)]
        public readonly array $edges,
        public readonly string $returnAddress,
        public readonly string|Optional $selectedId = new Optional(),
        public readonly TaskGraphSuggestion|Optional $suggestion = new Optional(),
        public readonly TaskGraphDestinations|Optional $destinations = new Optional(),
    ) {}
}
