<?php

declare(strict_types=1);

namespace App\Settings\Support;

use App\Actors\Contracts\Actor;
use App\Settings\Contracts\SettingsAccessPolicy;
use App\Ui\Contracts\VisibilityCheck;

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
