<?php

declare(strict_types=1);

namespace Domain\Access\Commands\GrantEnvironmentAccess;

use App\Actors\Enums\ChatPermission;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Access\Policies\EnvironmentAccessPolicy;

/**
 * The owner admits a user to the chats of an environment, this installation when none is named, with the permissions
 * named; the grant the user held there is replaced.
 *
 * @extends Command<null>
 */
#[Authorize(EnvironmentAccessPolicy::class, AccessType::Edit)]
final readonly class GrantEnvironmentAccessCommand extends Command
{
    /**
     * @param  list<ChatPermission>  $permissions
     */
    public function __construct(
        public string $userId,
        public string|null $environmentId,
        public array $permissions,
    ) {}
}
