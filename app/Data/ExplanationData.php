<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What a shell line is, read without running it: its outcome, a diagnostic when it did not read, its nodes in order
 * and how many of them are commands the shell would run.
 */
#[TypeScript]
final class ExplanationData extends Data
{
    /**
     * @param  list<ExplainedNodeData>  $nodes
     * @param  list<string>  $requiredClasses  the union of every class the command needs
     * @param  list<HeldPartData>  $held  the parts the journal will not run yet, each with its command request
     */
    public function __construct(
        public readonly string $outcome,
        public readonly string|null $diagnostic,
        public readonly int|null $diagnosticPosition,
        public readonly int $executableParts,
        #[DataCollectionOf(ExplainedNodeData::class)]
        public readonly array $nodes,
        public readonly array $requiredClasses = [],
        public readonly bool $isKnown = true,
        #[DataCollectionOf(HeldPartData::class)]
        public readonly array $held = [],
        public readonly string $notice = '',
    ) {}
}
