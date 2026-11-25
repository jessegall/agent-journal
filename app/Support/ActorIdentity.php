<?php

declare(strict_types=1);

namespace App\Support;

use App\Concerns\ComparesTypeAndId;
use App\Contracts\Actors\Actor;
use App\Contracts\Actors\StoredActor;
use App\Exceptions\InvalidActorText;
use App\Models\Access\User;
use App\Models\Agents\Agent;

/**
 * Who an actor is, by type and id, apart from any request or session: user 3 and agent 3 are different actors.
 */
final readonly class ActorIdentity
{
    use ComparesTypeAndId;

    private function __construct(
        public string $type,
        public string $id,
    ) {}

    public static function of(Actor $actor): self
    {
        return new self($actor->actorType(), $actor->actorId());
    }

    /**
     * The actor of a class by its id, when only the id is at hand.
     *
     * @param  class-string<StoredActor>  $class
     */
    public static function ofClass(string $class, string $id): self
    {
        return new self($class::storedType(), $id);
    }

    /**
     * An actor written as type:id, such as agent:01jd8x0g9m3qz6v4k2t7r5w1ce, as a command line takes it. Text from
     * outside never names the journal itself.
     *
     * @throws InvalidActorText
     */
    public static function fromText(string $text): self
    {
        if (preg_match('/^([a-z-]+):([0-9a-hjkmnp-tv-z]{26})$/i', $text, $parts) !== 1) {
            throw InvalidActorText::for($text);
        }

        $type = strtolower($parts[1]);

        if ($type === SystemActor::storedType()) {
            throw InvalidActorText::for($text);
        }

        return new self($type, strtolower($parts[2]));
    }

    /**
     * The actor a row's two columns point at, its type and its id, as the journal wrote them.
     */
    public static function fromStored(string $type, string $id): self
    {
        return new self($type, $id);
    }

    /**
     * The journal itself, for trusted Core code; text from outside never names it.
     */
    public static function system(): self
    {
        return self::of(new SystemActor());
    }

    /**
     * This actor as text, such as agent:01j..., as a command line takes it
     */
    public function text(): string
    {
        return "{$this->type}:{$this->id}";
    }

    /**
     * This actor as the two fields of a call body that the prefix names, such as recipientType and recipientId.
     *
     * @return array<string, string|int>
     */
    public function asFields(string $prefix): array
    {
        return [
            "{$prefix}Type" => $this->type,
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
            "{$prefix}_type" => $this->type,
            "{$prefix}_id" => $this->id,
        ];
    }

    /**
     * @return array{type: string, id: string}
     */
    public function toArray(): array
    {
        return [
            'type' => $this->type,
            'id' => $this->id,
        ];
    }

    public function isUser(): bool
    {
        return $this->type === User::storedType();
    }

    public function isAgent(): bool
    {
        return $this->type === Agent::storedType();
    }
}
