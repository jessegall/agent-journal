<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\Inbox;
use App\Communication\Enums\MessageState;
use App\Communication\Exceptions\MessageToSelf;

/**
 * Everything a new message is made of: the inbox it comes from, the inbox it goes to, the actor that wrote it, its
 * body, whether it waits for an answer, and the message it answers.
 */
final readonly class MessageEnvelope
{
    /**
     * @throws MessageToSelf
     */
    public function __construct(
        public Inbox $source,
        public Inbox $destination,
        public ActorIdentity $author,
        public MessageBody $body,
        public MessageState $state,
        public string|null $replyToId,
    ) {
        if ($source->inboxId() === $destination->inboxId()) {
            throw MessageToSelf::forInbox($source->inboxId());
        }
    }

    /**
     * @throws MessageToSelf
     */
    public static function send(Inbox $source, Inbox $destination, ActorIdentity $author, MessageBody $body): self
    {
        return new self($source, $destination, $author, $body, MessageState::Sent, null);
    }

    /**
     * @throws MessageToSelf
     */
    public static function ask(Inbox $source, Inbox $destination, ActorIdentity $author, MessageBody $body): self
    {
        return new self($source, $destination, $author, $body, MessageState::WaitingForAnswer, null);
    }

    /**
     * @throws MessageToSelf
     */
    public static function reply(
        Inbox $source,
        Inbox $destination,
        ActorIdentity $author,
        MessageBody $body,
        string $originalId,
    ): self {
        return new self($source, $destination, $author, $body, MessageState::Sent, $originalId);
    }
}
