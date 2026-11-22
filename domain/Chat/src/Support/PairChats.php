<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Support\AgentOption;
use App\Communication\Enums\IntervalRole;
use App\Communication\Support\ChatInboxes;
use App\Communication\Support\InboxIntervals;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Models\DirectChat;
use Illuminate\Support\Str;

/**
 * The direct chat of a user and one agent: found by the pair, or opened once under the pair's lock with its own chat
 * inbox, owned by the user, and both of them joined.
 */
final readonly class PairChats
{
    public function __construct(
        private ChatInboxes $chats,
        private InboxIntervals $intervals,
    ) {}

    public function open(ActorIdentity $user, AgentOption $agent): Conversation
    {
        $peer = new ActorIdentity(ActorType::Agent, $agent->agentId);
        DirectChat::lockPair(null, $user, $peer);

        $existing = DirectChat::findPair(null, $user, $peer);

        if ($existing !== null) {
            return $existing->conversation;
        }

        $providerId = strtolower((string) Str::ulid());
        $inboxId = $this->chats->open($providerId);
        $conversation = Conversation::openFor($inboxId, $providerId, $user, null, null);
        DirectChat::recordFor($conversation, null, $user, $peer);

        $inbox = new ChatInbox($inboxId, $agent->name);
        $this->intervals->join($inbox, $user, IntervalRole::Owner);
        $this->intervals->join($inbox, $peer, IntervalRole::Member);

        return $conversation;
    }
}
