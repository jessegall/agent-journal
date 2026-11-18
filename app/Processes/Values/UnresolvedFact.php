<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\UnresolvedType;

/**
 * Something about a node the classifier could not place, which keeps the command unknown.
 */
final readonly class UnresolvedFact
{
    public function __construct(
        public UnresolvedType $type,
        public int $node,
        public string $reason,
    ) {}
}
