<?php

declare(strict_types=1);

namespace App\Core\Actors\Support;

use App\Core\Actors\Enums\ActorKind;
use App\Core\Actors\Exceptions\InvalidActorText;
use App\Core\Actors\Contracts\Actor;

/**
 * Who an actor is, by kind and id, apart from any request or session: user 3 and agent 3 are different actors.
 */
final readonly class ActorIdentity
{
    public function __construct(
        public ActorKind $kind,
        public int $id,
    ) {}

    public static function of(Actor $actor): self
    {
        return new self($actor->actorKind(), $actor->actorId());
    }

    /**
     * An actor written as kind:id, such as agent:12 or user:1, as a command line takes it.
     *
     * @throws InvalidActorText
     */
    public static function fromText(string $text): self
    {
        if (preg_match('/^(agent|user):([1-9][0-9]*)$/', $text, $parts) !== 1) {
            throw InvalidActorText::for($text);
        }

        return new self(ActorKind::from($parts[1]), (int) $parts[2]);
    }

    /**
     * This actor as the two fields of a call body that the prefix names, such as recipientKind and recipientId.
     *
     * @return array<string, string|int>
     */
    public function asFields(string $prefix): array
    {
        return ["{$prefix}Kind" => $this->kind->value, "{$prefix}Id" => $this->id];
    }

    public function isSameAs(self $other): bool
    {
        return $this->kind === $other->kind && $this->id === $other->id;
    }
}
