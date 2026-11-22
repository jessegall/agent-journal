<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Authorization\VisibilityCheck;
use App\Contracts\Settings\SettingsAccessPolicy;

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
