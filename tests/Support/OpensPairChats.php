<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Chat\Support\ChatInboxes;

/**
 * Opens the direct chat of two actors as the chat does: a pair inbox both are attached to, with the personal inbox of
 * each made too.
 */
trait OpensPairChats
{
    abstract protected function inboxOf(ActorIdentity $actor): Inbox;

    /**
     * The two actors' pair chat inbox, both attached.
     */
    protected function pairChat(ActorIdentity $first, ActorIdentity $second): Inbox
    {
        $this->inboxOf($first);
        $this->inboxOf($second);

        $members = [$first->text(), $second->text()];
        sort($members);

        $inbox = Inbox::create(ChatInboxes::PAIR_PROVIDER, implode('|', $members), 'Chat');
        $now = CarbonImmutable::now();
        InboxMember::create($inbox->id, $first, $now);
        InboxMember::create($inbox->id, $second, $now);

        return $inbox;
    }
}
