<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Chat\Inbox;
use App\Enums\MessageState;
use App\Models\Message;
use App\Models\TimelineEvent;

/**
 * Everything a new chat message is made of: the one chat inbox it is posted in, the member that wrote it, its body,
 * whether it waits for an answer, the message it replies to, whom it addresses and who may settle it, the user
 * message it belongs under, and the request key that makes a retry return it.
 */
final readonly class ChatEnvelope
{
    public function __construct(
        public Inbox $inbox,
        public ActorIdentity $author,
        public MessageBody $body,
        public MessageState $state,
        public Message|null $parent,
        public ActorIdentity|null $addressee,
        public ActorIdentity|null $respondent,
        public string|null $userRootId,
        public string $requestKey,
        public bool $answersParent = false,
    ) {}

    /**
     * An answer to a waiting question, posted as a reply under it.
     */
    public static function answer(
        Inbox $inbox,
        ActorIdentity $author,
        MessageBody $body,
        Message $question,
        string $requestKey,
    ): self {
        return new self(
            $inbox,
            $author,
            $body,
            MessageState::Sent,
            $question,
            null,
            null,
            $question->user_root_id,
            $requestKey,
            true,
        );
    }

    /**
     * The same message, under the user message the author's turn to speak belongs to.
     */
    public function underRoot(string $userRootId): self
    {
        return new self(
            $this->inbox,
            $this->author,
            $this->body,
            $this->state,
            $this->parent,
            $this->addressee,
            $this->respondent,
            $userRootId,
            $this->requestKey,
            $this->answersParent,
        );
    }

    /**
     * The same question, put to the one member that must settle it.
     */
    public function askedOf(ActorIdentity $respondent): self
    {
        return new self(
            $this->inbox,
            $this->author,
            $this->body,
            $this->state,
            $this->parent,
            $this->addressee ?? $respondent,
            $respondent,
            $this->userRootId,
            $this->requestKey,
            $this->answersParent,
        );
    }

    public function isQuestion(): bool
    {
        return $this->state === MessageState::WaitingForAnswer;
    }

    /**
     * Whether this is the answer to the given question.
     */
    public function isAnswerTo(string $questionId): bool
    {
        return $this->answersParent && $this->parent?->id === $questionId;
    }

    /**
     * A post, addressed to one member when it names one; every member still receives it.
     */
    public static function post(
        Inbox $inbox,
        ActorIdentity $author,
        MessageBody $body,
        string $requestKey,
        ActorIdentity|null $addressee = null,
    ): self {
        return new self($inbox, $author, $body, MessageState::Sent, null, $addressee, null, null, $requestKey);
    }

    public static function ask(
        Inbox $inbox,
        ActorIdentity $author,
        MessageBody $body,
        ActorIdentity|null $respondent,
        string $requestKey,
    ): self {
        return new self(
            $inbox,
            $author,
            $body,
            MessageState::WaitingForAnswer,
            null,
            $respondent,
            $respondent,
            null,
            $requestKey,
        );
    }

    /**
     * A reply under its parent, in the parent's inbox and under the parent's user message.
     */
    public static function reply(
        Inbox $inbox,
        ActorIdentity $author,
        MessageBody $body,
        Message $parent,
        string $requestKey,
    ): self {
        return new self(
            $inbox,
            $author,
            $body,
            MessageState::Sent,
            $parent,
            null,
            null,
            $parent->user_root_id,
            $requestKey,
        );
    }

    /**
     * The fingerprint of what the request asks to post, so a retry with the same key is told apart from a different
     * message under it.
     */
    public function digest(): string
    {
        return hash('sha256', (string) json_encode([
            $this->state->value,
            $this->body->text,
            $this->parent?->id,
            $this->answersParent,
            $this->addressee?->toArray(),
            $this->respondent?->toArray(),
        ]));
    }

    /**
     * This envelope posted at its timeline event.
     */
    public function placedAt(TimelineEvent $event): PlacedChatEnvelope
    {
        return new PlacedChatEnvelope($this, $event);
    }
}
