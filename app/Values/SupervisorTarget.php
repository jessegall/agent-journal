<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\InvalidActorText;
use App\Exceptions\ProfileKeyInvalid;
use App\Exceptions\SupervisorRouteInvalid;
use App\Support\ActorIdentity;

final readonly class SupervisorTarget
{
    private const string PROFILE_PREFIX = 'profile:';

    public function __construct(public string $key = 'owner')
    {
        if ($this->isOwner()) {
            return;
        }

        try {
            if ($this->isProfile()) {
                $this->profileKey();

                return;
            }

            ActorIdentity::fromText($key);
        } catch (InvalidActorText|ProfileKeyInvalid $failure) {
            throw SupervisorRouteInvalid::target($key, $failure);
        }
    }

    public static function parse(string $text): self
    {
        return new self(strtolower($text));
    }

    public static function forProfile(ProfileKey $profile): self
    {
        return new self(self::PROFILE_PREFIX.$profile->key);
    }

    public static function forActor(ActorIdentity $actor): self
    {
        return self::parse($actor->text());
    }

    public function isOwner(): bool
    {
        return $this->key === 'owner';
    }

    public function isProfile(): bool
    {
        return str_starts_with($this->key, self::PROFILE_PREFIX);
    }

    public function profileKey(): ProfileKey
    {
        return ProfileKey::from(substr($this->key, strlen(self::PROFILE_PREFIX)));
    }
}
