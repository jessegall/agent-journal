<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\RevokeCommandPermissions;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\PermissionRevocation;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\CommandPatternSet;

final readonly class RevokeCommandPermissionsHandler implements CommandHandler
{
    public function __construct(private CurrentAuthorizer $administration, private CurrentActor $actors) {}

    public function handle(RevokeCommandPermissions $command): string
    {
        $this->administration->authorize(ProcessAdministrationPolicy::class, CommandRequest::class, ProcessAbility::Administer);

        return PermissionRevocation::revoke(
            $command->source,
            CommandClassSet::of(...$command->classes),
            CommandPatternSet::of(...$command->patterns),
            ActorIdentity::of($this->actors->actor()),
        )->id;
    }
}
