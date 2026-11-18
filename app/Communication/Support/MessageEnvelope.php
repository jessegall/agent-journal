<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\ReceivesMessages;
use App\Actors\Contracts\SendsMessages;
use App\Actors\Support\ActorIdentity;
use App\Communication\Exceptions\AnswerImpossible;
use App\Communication\Exceptions\MessageToSelf;

/**
 * Everything a new message is stored with, checked once for every send, ask and reply: it never goes to its own
 * sender, and an ask needs a recipient that can answer and a sender that can receive the answer.
 */
final readonly class MessageEnvelope
{
    private function __construct(
        public ActorIdentity $sender,
        public ActorIdentity $recipient,
        public MessageBody $body,
        public Submission $submission,
        public string|null $replyToId,
    ) {}

    /**
     * @throws MessageToSelf
     */
    public static function send(
        ActorIdentity $sender,
        ActorIdentity $recipient,
        MessageBody $body,
        Submission $submission,
        string|null $replyToId = null,
    ): self {
        if ($sender->isSameAs($recipient)) {
            throw MessageToSelf::forActor();
        }

        return new self($sender, $recipient, $body, $submission, $replyToId);
    }

    /**
     * @throws MessageToSelf
     * @throws AnswerImpossible
     */
    public static function ask(Actor $sender, Actor $recipient, MessageBody $body, Submission $submission): self
    {
        if (! $sender instanceof ReceivesMessages || ! $recipient instanceof SendsMessages) {
            throw AnswerImpossible::forAsk();
        }

        return self::send(ActorIdentity::of($sender), ActorIdentity::of($recipient), $body, $submission);
    }
}
