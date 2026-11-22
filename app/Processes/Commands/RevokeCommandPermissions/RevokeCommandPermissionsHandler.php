<?php

declare(strict_types=1);

namespace App\Processes\Commands\RevokeCommandPermissions;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Models\PermissionRevocation;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\CommandPatternSet;

final readonly class RevokeCommandPermissionsHandler implements CommandHandler
{
    public function handle(RevokeCommandPermissionsCommand $command): string
    {

        return PermissionRevocation::create(
            $command->source,
            CommandClassSet::of(...$command->classes),
            CommandPatternSet::of(...$command->patterns),
            ActorIdentity::of($command->dispatchedBy()),
        )->id;
    }
}
