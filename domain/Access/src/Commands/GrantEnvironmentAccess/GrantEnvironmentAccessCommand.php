<?php

declare(strict_types=1);

namespace Domain\Access\Commands\GrantEnvironmentAccess;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Enums\ChatPermission;
use App\Support\Command;
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
