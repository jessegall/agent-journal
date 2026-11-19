<?php

declare(strict_types=1);

namespace App\Processes\Values;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * What a known, completely read command line runs, lowered from its syntax tree (doc 21 revision 6, section 53): the
 * root step and the digest of the tree it came from. Every node is planned before the first side effect, and no step
 * holds a reassembled shell string.
 */
final class ExecutionPlan extends Data
{
    public function __construct(
        public readonly PlanStep $root,
        #[MapName('tree_digest')]
        public readonly string $treeDigest,
    ) {}

    /**
     * @return list<PlanStep>
     */
    public function steps(): array
    {
        return $this->root->flatten();
    }
}
