<?php

declare(strict_types=1);

namespace App\Skills\Values;

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
}
