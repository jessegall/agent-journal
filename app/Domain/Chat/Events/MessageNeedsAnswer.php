<?php

declare(strict_types=1);

namespace App\Domain\Chat\Events;

use App\Domain\Hooks\Storage\StackTarget;

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
