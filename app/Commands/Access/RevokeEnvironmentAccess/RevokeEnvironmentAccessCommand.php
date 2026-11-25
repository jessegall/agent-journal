<?php

declare(strict_types=1);

namespace App\Commands\Access\RevokeEnvironmentAccess;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\EnvironmentAccessPolicy;
use App\Support\Command;

/**
 * The owner revokes a user's grant to an environment's chats, and every chat the user lost there ends for it.
 *
 * @extends Command<null>
 */
#[Authorize(EnvironmentAccessPolicy::class, AccessType::Edit)]
final readonly class RevokeEnvironmentAccessCommand extends Command
{
    public function __construct(
        public string $userId,
        public string|null $environmentId,
    ) {}
}
