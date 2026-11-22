<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Enums\IntervalRole;
use App\Models\DeskRecord;
use App\Support\ActorIdentity;
use App\Support\ChatInboxes;
use App\Support\InboxIntervals;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Models\DirectChat;
use Domain\Chat\Support\ChatInbox;
use Illuminate\Support\Str;

/**
 * Opens the direct chat of two actors for a test: its chat inbox, its metadata owned by the first actor, the pair
 * lookup and an active interval for each, as the chat's own opening writes them.
 */
trait OpensPairChats
{
    abstract protected function inboxOf(ActorIdentity $actor): DeskRecord;

    /**
     * The two actors' direct chat, with the desk inbox of each made too, as a chat between them needs.
     */
    protected function pairChat(ActorIdentity $first, ActorIdentity $second): Conversation
    {
        $this->inboxOf($first);
        $this->inboxOf($second);

        $providerId = strtolower((string) Str::ulid());
        $inboxId = $this->app->make(ChatInboxes::class)->open($providerId);
        $conversation = Conversation::create($inboxId, $providerId, $first, null, null);
        DirectChat::recordFor($conversation, null, $first, $second);

        $inbox = new ChatInbox($inboxId, 'Chat');
        $intervals = $this->app->make(InboxIntervals::class);
        $intervals->enter($inbox, $first, IntervalRole::Owner);
        $intervals->enter($inbox, $second, IntervalRole::Member);

        return $conversation;
    }
}
