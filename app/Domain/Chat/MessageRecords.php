<?php

declare(strict_types=1);

namespace App\Domain\Chat;

use App\Core\Hooks\Storage\StackTarget;
use App\Domain\Chat\Exceptions\MessageMissing;
use App\Domain\Chat\Models\Message;

/**
 * The named reads of messages the Chat domain answers for: the calling agent's own, and one the journal addressed.
 */
final readonly class MessageRecords
{
    public function get(int $messageId): Message
    {
        return Message::query()->forActor()->find($messageId) ?? throw MessageMissing::forId($messageId);
    }

    /**
     * The journal's own read of a message it addressed to an agent, outside that agent's requests.
     */
    public function addressedTo(StackTarget $target, int $messageId): Message
    {
        return Message::query()->ownedBy($target->agentId)->find($messageId) ?? throw MessageMissing::forId($messageId);
    }

    /**
     * The conversation with one agent's session, as the person acting in this request may read it.
     */
    public function conversationWith(StackTarget $target): Conversation
    {
        $messages = Message::query()->visibleToPerson()
            ->where('agent_id', $target->agentId)
            ->where('session_id', $target->sessionId)
            ->orderBy('id')
            ->get()
            ->all();

        return new Conversation($target, array_values($messages));
    }
}
