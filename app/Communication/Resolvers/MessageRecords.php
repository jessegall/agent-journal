<?php

declare(strict_types=1);

namespace App\Communication\Resolvers;

use App\Agents\Support\StackTarget;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Data\Conversation;
use App\Communication\Data\MessageView;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Models\Message;
use Illuminate\Container\Attributes\Scoped;

/**
 * The named reads of messages the Chat domain answers for: the calling agent's own, and one the journal addressed.
 */
#[Scoped]
final readonly class MessageRecords implements ConversationResolver
{
    public function get(string $messageId): Message
    {
        return Message::query()->forActor()->find($messageId) ?? throw MessageMissing::forId($messageId);
    }

    /**
     * The messages of these ids the actor may read, by id, in one read.
     *
     * @param  list<string>  $messageIds
     * @return array<string, Message>
     */
    public function many(array $messageIds): array
    {
        return Message::query()->forActor()->whereKey($messageIds)->readLimit(count($messageIds))->get()->keyBy('id')->all();
    }

    /**
     * The journal's own read of a message it addressed to an agent, outside that agent's requests.
     */
    public function addressedTo(StackTarget $target, string $messageId): Message
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
            ->readAll('the whole conversation, oldest first, until it is paged')
            ->get()
            ->all();

        return new Conversation($target, array_values(array_map(
            fn (Message $message) => new MessageView($message->id, $message->body, $message->state),
            $messages,
        )));
    }
}
