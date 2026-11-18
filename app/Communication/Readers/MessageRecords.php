<?php

declare(strict_types=1);

namespace App\Communication\Readers;

use App\Actors\Enums\ActorType;
use App\Agents\Support\StackTarget;
use App\Communication\Contracts\ConversationReader;
use App\Communication\Data\Conversation;
use App\Communication\Data\MessageView;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Models\Message;
use App\Communication\Models\Scopes\MessageVisibility;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Builder;

/**
 * The named reads of messages the Chat domain answers for: the calling agent's own, and one the journal addressed.
 */
#[Scoped]
final readonly class MessageRecords implements ConversationReader
{
    public function get(string $messageId): Message
    {
        return Message::query()->find($messageId) ?? throw MessageMissing::forId($messageId);
    }

    /**
     * The messages of these ids the actor may read, by id, in one read.
     *
     * @param  list<string>  $messageIds
     * @return array<string, Message>
     */
    public function many(array $messageIds): array
    {
        return Message::query()
            ->whereKey($messageIds)
            ->readLimit(count($messageIds))
            ->get()
            ->keyBy('id')
            ->all();
    }

    /**
     * The journal's own read of a message it addressed to an agent, outside that agent's requests.
     */
    public function addressedTo(StackTarget $target, string $messageId): Message
    {
        return Message::query()
            ->withoutGlobalScope(MessageVisibility::class)
            ->where('recipient_type', ActorType::Agent->value)
            ->where('recipient_id', $target->agentId)
            ->find($messageId) ?? throw MessageMissing::forId($messageId);
    }

    /**
     * The conversation with one agent's session, as the user acting in this request may read it.
     */
    public function conversationWith(StackTarget $target): Conversation
    {
        $messages = Message::query()->inspectedByUser()
            ->where(fn (Builder $either) => $either
                ->where(fn (Builder $sent) => $sent
                    ->where('sender_type', ActorType::Agent->value)
                    ->where('sender_id', $target->agentId))
                ->orWhere(fn (Builder $received) => $received
                    ->where('recipient_type', ActorType::Agent->value)
                    ->where('recipient_id', $target->agentId)))
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
