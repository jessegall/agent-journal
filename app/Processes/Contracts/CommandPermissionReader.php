<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Processes\Values\CommandPermissions;

/**
 * What the current session, or a given actor, may run.
 */
interface CommandPermissionReader
{
    public function forCurrentSession(): CommandPermissions;

    public function forActor(ActorIdentity $actor): CommandPermissions;
}
