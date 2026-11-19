<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Support\ActorIdentity;
use PhpOption\Option;

/**
 * The inbox an actor's dispatched work answers to: its forwarding desk's inbox, else its preferred desk's inbox.
 */
interface ReplyInboxes
{
    /**
     * @return Option<string>
     */
    public function replyInboxIdFor(ActorIdentity $dispatcher): Option;
}
