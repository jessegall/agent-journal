<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Models\Inboxes\Inbox;
use App\Support\ActorIdentity;
use Tests\Support\Seeding\FixtureInboxes;

/**
 * Opens the direct chat of two actors as the chat does: a pair inbox both are attached to, with the personal inbox of
 * each made too.
 */
trait OpensPairChats
{
    /**
     * The two actors' pair chat inbox, both attached.
     */
    protected function pairChat(ActorIdentity $first, ActorIdentity $second): Inbox
    {
        return new FixtureInboxes($this->app)->pairChat($first, $second);
    }
}
