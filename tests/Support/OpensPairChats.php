<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Support\ActorIdentity;
use App\Communication\Models\InboxRecord;
use App\Desks\Models\DeskRecord;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Models\DirectChat;
use Illuminate\Support\Str;

/**
 * Opens the direct chat of two actors for a test: its chat inbox, its metadata owned by the first actor and the pair
 * lookup, as the chat's own opening writes them.
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
        $inbox = InboxRecord::create('chat', $providerId);
        $conversation = Conversation::openFor($inbox->id, $providerId, $first, null, null);
        DirectChat::recordFor($conversation, null, $first, $second);

        return $conversation;
    }
}
