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
     */
    public function __construct(
        public readonly int $id,
        public readonly string $type,
        public readonly int|null $parent,
        public readonly string $snippet,
        public readonly array $redirects,
    ) {}
}
