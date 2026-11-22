<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\ActorIdentity;
use App\Values\CommandPermissions;

/**
 * What the current session, or a given actor, may run.
 */
interface CommandPermissionResolver
{
    public function forCurrentSession(): CommandPermissions;

    public function forActor(ActorIdentity $actor): CommandPermissions;
}
