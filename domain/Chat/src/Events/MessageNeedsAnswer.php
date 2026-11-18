<?php

declare(strict_types=1);

namespace Domain\Chat\Events;

use App\Agents\Support\StackTarget;

/**
 * A message now waits for an agent's answer, raised inside the transaction that asked for it.
 */
final readonly class MessageNeedsAnswer
{
    public function __construct(
        public int $messageId,
        public StackTarget $target,
    ) {}
}
