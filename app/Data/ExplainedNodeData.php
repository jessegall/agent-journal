<?php

declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One node of an explained shell line: its id, type, parent, a safe snippet of its source and its redirects in order.
 */
#[TypeScript]
final class ExplainedNodeData extends Data
{
    /**
     * @param  list<string>  $redirects
     * @param  list<string>  $classes  the classes this node carries itself, as values such as read
     * @param  list<string>  $provenance  where each of those classes comes from, such as rule:core.cat@1
     * @param  list<string>  $unresolved  why something about this node could not be placed
     * @param  list<string>  $contract  the contract a test, check or build part is judged by, as readable lines
     */
    public function __construct(
        public readonly int $id,
        public readonly string $type,
        public readonly int|null $parent,
        public readonly string $snippet,
        public readonly array $redirects,
        public readonly string $program = '',
        public readonly string $original = '',
        public readonly array $classes = [],
        public readonly array $provenance = [],
        public readonly array $unresolved = [],
        public readonly string $purpose = '',
        public readonly array $contract = [],
    ) {}
}
