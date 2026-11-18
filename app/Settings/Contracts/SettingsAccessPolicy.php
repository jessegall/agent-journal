<?php

declare(strict_types=1);

namespace App\Settings\Contracts;

use App\Actors\Contracts\Actor;

/**
 * Whether an actor may read the settings catalogue and change settings. Settings denies everyone by default; the
 * layer that knows the journal's owner binds the policy that lets the owner in.
 */
interface SettingsAccessPolicy
{
    public function allows(Actor $actor): bool;
}
