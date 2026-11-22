<?php

declare(strict_types=1);

namespace App\Commands\RevokeCommandPermissions;

use App\Contracts\CommandHandler;
use App\Models\PermissionRevocation;
use App\Support\ActorIdentity;
use App\Values\CommandClassSet;
use App\Values\CommandPatternSet;

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
