<?php

declare(strict_types=1);

namespace App\Skills\Values;

use App\Actors\Values\AccessRequirement;
use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileSnapshot;

/**
 * The profile a session was started with, or the explicit state of a main agent started without one.
 */
final readonly class StartProfile
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
     * Whether the pinned profile grants the requirement; a session started without one is granted nothing.
     */
    public function grants(AccessRequirement $requirement): bool
    {
        return $this->snapshot !== null
            && $this->snapshot->authorization->grants($requirement->policy, $requirement->access);
    }

    /**
     * @param  list<ProfileBase>  $bases
     */
    public function startsFromAnyOf(array $bases): bool
    {
        return $this->snapshot !== null
            && array_any($bases, fn (ProfileBase $base) => $base->is($this->snapshot->base));
    }

    /**
     * @param  list<string>  $keys
     */
    public function hasKeyIn(array $keys): bool
    {
        return $this->snapshot !== null && in_array($this->snapshot->key->key, $keys, true);
    }

    /**
     * The skills the profile requires; none for a session started without one.
     *
     * @return list<string>
     */
    public function requiredSkills(): array
    {
        return $this->snapshot === null ? [] : $this->snapshot->requiredSkills;
    }

    /**
     * The profile's key and revision, such as reviewer@3, or null for a session started without one.
     */
    public function revisionText(): string|null
    {
        return $this->snapshot === null ? null : $this->snapshot->key->key.'@'.$this->snapshot->revision;
    }
}
