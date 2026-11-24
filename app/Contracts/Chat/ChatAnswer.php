<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Contracts\Events\Event;
use App\Support\ActorIdentity;

/**
 * What a member does in a chat that answers everything waiting on it there: a message of its own, or a reaction.
 */
interface ChatAnswer extends Event
{
    public string $inboxId { get; }

    /**
     * The member that answered.
     */
    public function answerer(): ActorIdentity;
}
