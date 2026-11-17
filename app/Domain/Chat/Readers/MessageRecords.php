<?php

declare(strict_types=1);

namespace App\Domain\Chat\Readers;

use App\Core\Hooks\Support\StackTarget;
use App\Domain\Chat\Api\Conversation;
use App\Domain\Chat\Api\MessageView;
use App\Domain\Chat\Contracts\ConversationReader;
use App\Domain\Chat\Exceptions\MessageMissing;
use App\Domain\Chat\Models\Message;
use Illuminate\Container\Attributes\Scoped;

/**
 * The named reads of messages the Chat domain answers for: the calling agent's own, and one the journal addressed.
 */
#[Scoped]
final readonly class MessageRecords implements ConversationReader
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
     * The conversation with one agent's session, as the user acting in this request may read it.
     */
    public function conversationWith(StackTarget $target): Conversation
    {
        $messages = Message::query()->visibleToUser()
            ->where('agent_id', $target->agentId)
            ->where('session_id', $target->sessionId)
            ->orderBy('id')
            ->get()
            ->all();

        return new Conversation($target, array_values(array_map(
            fn (Message $message) => new MessageView($message->id, $message->body, $message->state),
            $messages,
        )));
    }
}
