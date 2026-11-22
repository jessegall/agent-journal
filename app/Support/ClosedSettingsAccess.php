<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actor;
use App\Contracts\SettingsAccessPolicy;

/**
 * The policy while nothing else is bound: nobody may read or change settings.
 */
final readonly class ClosedSettingsAccess implements SettingsAccessPolicy
{
    public function allows(Actor $actor): bool
    {
        return false;
    }
}
