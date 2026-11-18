<?php

declare(strict_types=1);

namespace App\Settings\Support;

use App\Actors\Contracts\Actor;
use App\Settings\Contracts\SettingsAccessPolicy;

/**
 * The policy while nothing else is bound: nobody may read or change settings.
 */
final readonly class DenyAllSettingsAccess implements SettingsAccessPolicy
{
    public function allows(Actor $actor): bool
    {
        return false;
    }
}
