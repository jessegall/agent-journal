<?php

declare(strict_types=1);

namespace App\Domain\Chat\Events;

use App\Core\Hooks\StackTarget;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A person sent a message to an agent's session; raised once the send has committed.
 */
final readonly class MessageSent implements ShouldDispatchAfterCommit
{
    public function __construct(
        public int $messageId,
        public StackTarget $target,
    ) {}
}
