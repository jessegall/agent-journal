<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Contracts\Events\Event;
use App\Support\ActorIdentity;

/**
 * A waiting message put before one member to answer: offered in its turn in a chat, or claimed by it.
 */
interface MessageOffered extends Event
{
    public string $inboxId { get; }

    public string $messageId { get; }

    /**
     * The member the message now waits on.
     */
    public function answerer(): ActorIdentity;
}
