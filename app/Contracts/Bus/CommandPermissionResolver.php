<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

use App\Support\ActorIdentity;
use App\Values\CommandPermissions;

/**
 * What the current session, or a given actor, may run.
 */
interface CommandPermissionResolver
{
    /**
     * The commands the current session may run.
     */
    public function forCurrentSession(): CommandPermissions;

    /**
     * The commands the actor may run.
     */
    public function forActor(ActorIdentity $actor): CommandPermissions;
}
