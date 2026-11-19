<?php

declare(strict_types=1);

namespace App\Communication\Resolvers;

use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Data\Conversation;
use App\Communication\Data\MessageView;
use App\Communication\Enums\MessageState;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Models\Message;
use Illuminate\Container\Attributes\Scoped;

/**
 * The named reads of messages the Chat domain answers for: the calling agent's own, and one the journal addressed.
 */
#[Scoped]
final readonly class MessageRecords implements ConversationResolver
{
    private const int OPEN_ROUNDS_READ = 100;

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
     * The journal's own read of a message it addressed to an actor, outside that actor's requests.
     */
    public function addressedTo(ActorIdentity $actor, string $messageId): Message
    {
        return Message::query()->ownedBy($actor)->find($messageId) ?? throw MessageMissing::forId($messageId);
    }

    /**
     * The messages whose open round waits on the actor, oldest first, for its new session's stack.
     *
     * @return list<Message>
     */
    public function openRoundsFor(ActorIdentity $actor): array
    {
        $messages = Message::query()->ownedBy($actor)->where('state', MessageState::WaitingForAnswer)->orderBy('id')
            ->readLimit(self::OPEN_ROUNDS_READ)
            ->get()->all();

        return array_values($messages);
    }

    /**
     * The conversation with one actor, as the user acting in this request may read it.
     */
    public function conversationWith(ActorIdentity $actor): Conversation
    {
        $messages = Message::query()->acrossOwners()
            ->byActor($actor)
            ->orderBy('id')
            ->readAll('the whole conversation, oldest first, until it is paged')
            ->get()
            ->all();

        return new Conversation($actor, array_values(array_map(
            fn (Message $message) => new MessageView($message->id, $message->body, $message->state),
            $messages,
        )));
    }
}
