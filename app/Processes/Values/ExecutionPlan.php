<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * What a known, completely read command line runs, lowered from its syntax tree (doc 21 revision 6, section 53): the
 * root step and the digest of the tree it came from. Every node is planned before the first side effect, and no step
 * holds a reassembled shell string.
 */
final readonly class ExecutionPlan
{
    public function __construct(public PlanStep $root, public string $treeDigest) {}

    /**
     * @return list<PlanStep>
     */
    public function steps(): array
    {
        return $this->root->flatten();
    }

    /**
     * @return array{root: array<string, mixed>, tree_digest: string}
     */
    public function toArray(): array
    {
        return ['root' => $this->root->toArray(), 'tree_digest' => $this->treeDigest];
    }

    /**
     * @param  array{root: array<string, mixed>, tree_digest: string}  $plan
     */
    public static function fromArray(array $plan): self
    {
        return new self(PlanStep::fromArray($plan['root']), $plan['tree_digest']);
    }
}
