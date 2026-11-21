<?php

declare(strict_types=1);

namespace App\Agents\Values;

/**
 * Where a connected project's child works: the claim its linked worktree is prepared for, the generation of that
 * claim, whether the child writes, and the commit the parent's read verified, which the worktree starts from.
 */
final readonly class ChildCheckout
{
    public function __construct(
        public string $claimId,
        public int $generation,
        public bool $writes,
        public string $baseOid,
    ) {}
}
