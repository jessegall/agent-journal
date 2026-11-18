<?php

declare(strict_types=1);

namespace App\Processes\Data;

use Spatie\LaravelData\Data;

/**
 * One node of an explained shell line: its id, type, parent, a safe snippet of its source and its redirects in order.
 */
final class ExplainedNodeData extends Data
{
    /**
     * @param  list<string>  $redirects
     * @param  list<string>  $classes  the classes this node carries itself, as values such as read
     * @param  list<string>  $provenance  where each of those classes comes from, such as rule:core.cat@1
     * @param  list<string>  $unresolved  why something about this node could not be placed
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
    ) {}
}
