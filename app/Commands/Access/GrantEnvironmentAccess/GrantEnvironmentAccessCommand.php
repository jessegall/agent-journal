<?php

declare(strict_types=1);

namespace App\Commands\Access\GrantEnvironmentAccess;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Enums\Messages\InboxPermission;
use App\Policies\EnvironmentAccessPolicy;
use App\Support\Command;

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
     * @param  list<InboxPermission>  $permissions
     */
    public function __construct(
        public string $userId,
        public string|null $environmentId,
        public array $permissions,
    ) {}
}
