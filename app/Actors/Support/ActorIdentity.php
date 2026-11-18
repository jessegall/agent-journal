<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\InvalidActorText;
use App\Actors\Support\Concerns\ComparesTypeAndId;

/**
 * Who an actor is, by type and id, apart from any request or session: user 3 and agent 3 are different actors.
 */
final readonly class ActorIdentity
{
    use ComparesTypeAndId;

    public function __construct(
        public ActorType $type,
        public string $id,
    ) {}

    public static function of(Actor $actor): self
    {
        return new self($actor->actorType(), $actor->actorId());
    }

    /**
     * An actor written as type:id, such as agent:01jd8x0g9m3qz6v4k2t7r5w1ce, as a command line takes it.
     *
     * @throws InvalidActorText
     */
    public static function fromText(string $text): self
    {
        if (preg_match('/^(agent|user):([0-9a-hjkmnp-tv-z]{26})$/i', $text, $parts) !== 1) {
            throw InvalidActorText::for($text);
        }

        return new self(ActorType::from($parts[1]), strtolower($parts[2]));
    }

    /**
     * This actor as the two fields of a call body that the prefix names, such as recipientType and recipientId.
     *
     * @return array<string, string|int>
     */
    public function asFields(string $prefix): array
    {
        return ["{$prefix}Type" => $this->type->value, "{$prefix}Id" => $this->id];
    }
}
