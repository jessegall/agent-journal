<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\RevokeCommandPermissions;

use App\Contracts\Bus\CommandHandler;
use App\Models\Profiles\PermissionRevocation;
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
            $command->dispatchedBy(),
        )->getKey();
    }
}
