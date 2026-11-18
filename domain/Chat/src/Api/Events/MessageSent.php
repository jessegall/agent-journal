<?php

declare(strict_types=1);

namespace Domain\Chat\Api\Events;

use App\Agents\Support\StackTarget;
use App\Ui\Contracts\UpdatesUserInterface;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A user sent a message to an agent's session; raised once the send has committed.
 */
final readonly class MessageSent implements ShouldDispatchAfterCommit, UpdatesUserInterface
{
    public function __construct(
        public int $messageId,
        public StackTarget $target,
    ) {}
}
