<?php

declare(strict_types=1);

namespace App\Settings;

use App\Access\Contracts\VisibilityCheck;
use App\Actors\Contracts\Actor;
use App\Settings\Contracts\SettingsAccessPolicy;

/**
 * Shows the settings page and its actions to the actor the settings access policy lets in, which is the owner.
 */
final readonly class SettingsOwnerCheck implements VisibilityCheck
{
    public function __construct(private SettingsAccessPolicy $policy) {}

    public function allows(Actor $actor): bool
    {
        return $this->policy->allows($actor);
    }
}
