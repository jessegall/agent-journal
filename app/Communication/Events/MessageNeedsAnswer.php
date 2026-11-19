<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Agents\Support\StackTarget;
use App\Contracts\Event;

/**
 * A message now waits for an agent's answer, raised inside the transaction that asked for it.
 */
final readonly class MessageNeedsAnswer implements Event
{
    public function __construct(
        public string $messageId,
        public StackTarget $target,
        public int $round,
    ) {}
}
