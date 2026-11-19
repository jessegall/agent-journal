<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\RevokeCommandPermissions;
use App\Processes\Models\PermissionRevocation;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\CommandPatternSet;

final readonly class RevokeCommandPermissionsHandler implements CommandHandler
{
    public function handle(RevokeCommandPermissions $command): string
    {

        return PermissionRevocation::revoke(
            $command->source,
            CommandClassSet::of(...$command->classes),
            CommandPatternSet::of(...$command->patterns),
            ActorIdentity::of($command->dispatchedBy()),
        )->id;
    }
}
