<?php

declare(strict_types=1);

namespace App\Actors\Support;

/**
 * What asks for an actor's attention: one message, seat change or state's message to an agent, with the receipt or
 * hook it was accepted under. The same origin always derives the same wake key for an actor, so a replay wakes nobody
 * twice.
 */
final readonly class AttentionOrigin
{
    public const string MESSAGE = 'message';

    public const string SEATING = 'seating';

    public const string AGENT_MESSAGE = 'agent_message';

    public function __construct(
        public string $type,
        public string $id,
        public string $receiptId,
    ) {}

    public static function message(string $messageId, string $receiptId): self
    {
        return new self(self::MESSAGE, $messageId, $receiptId);
    }

    /**
     * The states' messages kept for an agent that went idle on the hook that sent them.
     */
    public static function agentMessages(string $hookId): self
    {
        return new self(self::AGENT_MESSAGE, $hookId, $hookId);
    }

    public function keyFor(ActorIdentity $actor): string
    {
        return hash('sha256', "attention:{$this->type}:{$this->id}:{$actor->type->value}:{$actor->id}");
    }
}
