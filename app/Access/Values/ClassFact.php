<?php

declare(strict_types=1);

namespace App\Access\Values;

use App\Access\Contracts\Events\FactOrigin;
use App\CommandRules\Enums\CommandClass;

/**
 * One class a node of the tree carries, with where that knowledge came from and why.
 */
final readonly class ClassFact
{
    public function __construct(
        public CommandClass $class,
        public int $node,
        public FactOrigin $origin,
        public string $reason,
    ) {}
}
