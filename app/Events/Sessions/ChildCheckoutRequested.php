<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Asks\Contracts\AnsweredAtOnce;
use App\Sessions\ChildCheckoutSlot;

/**
 * A host claims the start of a child: the area that knows the child's project issues its claim and fills in the
 * checkout its worktree is prepared for, or leaves the slot empty for a child that works in the start folder.
 */
final readonly class ChildCheckoutRequested implements AnsweredAtOnce, SessionEvent
{
    public function __construct(
        public string $hostId,
        public string $parentSessionId,
        public string $childAgentId,
        public ChildCheckoutSlot $slot,
    ) {}
}
