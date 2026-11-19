<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Actors\Contracts\AuthoritySource;

/**
 * An agent's authority: the admitted profile revision its session was launched with.
 */
final readonly class LaunchProfileAuthority implements AuthoritySource
{
    public function __construct(public ProfileSnapshot $profile) {}

    public function description(): string
    {
        return "revision {$this->profile->revision} of profile {$this->profile->key->key}";
    }

    public function mayRunApplicationCommands(): bool
    {
        return true;
    }
}
