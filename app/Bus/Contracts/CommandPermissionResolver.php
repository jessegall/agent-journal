<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use App\Support\ActorReference;
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
    public function forActor(ActorReference $actor): CommandPermissions;
}
