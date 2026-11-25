<?php

declare(strict_types=1);

namespace App\Support;

use App\Concerns\ComparesTypeAndId;
use App\Contracts\Actors\Actor;
use App\Enums\ActorType;
use App\Exceptions\InvalidActorText;

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
     * The journal itself, for trusted Core code; text from outside never names it.
     */
    public static function system(): self
    {
        return self::of(new SystemActor());
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
     * This actor as the text fromText reads back, such as agent:01j...
     */
    public function text(): string
    {
        return "{$this->type->value}:{$this->id}";
    }

    /**
     * This actor as the two fields of a call body that the prefix names, such as recipientType and recipientId.
     *
     * @return array<string, string|int>
     */
    public function asFields(string $prefix): array
    {
        return [
            "{$prefix}Type" => $this->type->value,
            "{$prefix}Id" => $this->id,
        ];
    }

    /**
     * This actor as the two columns of a row that the prefix names, such as sender_type and sender_id.
     *
     * @return array<string, string>
     */
    public function asColumns(string $prefix): array
    {
        return [
            "{$prefix}_type" => $this->type->value,
            "{$prefix}_id" => $this->id,
        ];
    }

    /**
     * @return array{type: string, id: string}
     */
    public function toArray(): array
    {
        return [
            'type' => $this->type->value,
            'id' => $this->id,
        ];
    }

    public function isUser(): bool
    {
        return $this->type->isUser();
    }

    public function isAgent(): bool
    {
        return $this->type->isAgent();
    }
}
