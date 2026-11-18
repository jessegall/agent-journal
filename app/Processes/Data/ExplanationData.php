<?php

declare(strict_types=1);

namespace App\Processes\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * What a shell line is, read without running it: its outcome, a diagnostic when it did not read, its nodes in order
 * and how many of them are commands the shell would run.
 */
final class ExplanationData extends Data
{
    /**
     * @param  list<ExplainedNodeData>  $nodes
     */
    public function __construct(
        public readonly string $outcome,
        public readonly string|null $diagnostic,
        public readonly int|null $diagnosticPosition,
        public readonly int $executableParts,
        #[DataCollectionOf(ExplainedNodeData::class)]
        public readonly array $nodes,
    ) {}
}
