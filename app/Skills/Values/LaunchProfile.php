<?php

declare(strict_types=1);

namespace App\Skills\Values;

use App\Profiles\Enums\ProfileType;
use App\Profiles\Values\ProfileSnapshot;

/**
 * The profile a session was launched with, or the explicit state of a main agent launched without one.
 */
final readonly class LaunchProfile
{
    private function __construct(
        public ProfileSnapshot|null $snapshot,
    ) {}

    public static function of(ProfileSnapshot $snapshot): self
    {
        return new self($snapshot);
    }

    public static function profileFree(): self
    {
        return new self(null);
    }

    public function isProfileFree(): bool
    {
        return $this->snapshot === null;
    }

    /**
     * @param  list<ProfileType>  $types
     */
    public function hasTypeIn(array $types): bool
    {
        return $this->snapshot !== null && in_array($this->snapshot->type, $types, true);
    }

    /**
     * @param  list<string>  $keys
     */
    public function hasKeyIn(array $keys): bool
    {
        return $this->snapshot !== null && in_array($this->snapshot->key->key, $keys, true);
    }

    /**
     * The skills the profile requires; none for a session launched without one.
     *
     * @return list<string>
     */
    public function requiredSkills(): array
    {
        return $this->snapshot === null ? [] : $this->snapshot->requiredSkills;
    }

    /**
     * The profile's key and revision, such as reviewer@3, or null for a session launched without one.
     */
    public function revisionText(): string|null
    {
        return $this->snapshot === null ? null : $this->snapshot->key->key.'@'.$this->snapshot->revision;
    }
}
