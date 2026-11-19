<?php

declare(strict_types=1);

namespace App\Actors\Support;

/**
 * What asks for an actor's attention: one message or seat change, with the bus receipt it was accepted under. The
 * same origin always derives the same wake key for an actor, so a replay wakes nobody twice.
 */
final readonly class AttentionOrigin
{
    public const string MESSAGE = 'message';

    public const string SEATING = 'seating';

    public function __construct(
        public string $type,
        public string $id,
        public string $receiptId,
    ) {}

    public static function message(string $messageId, string $receiptId): self
    {
        return new self(self::MESSAGE, $messageId, $receiptId);
    }

    public function keyFor(ActorIdentity $actor): string
    {
        return hash('sha256', "attention:{$this->type}:{$this->id}:{$actor->type->value}:{$actor->id}");
    }
}
