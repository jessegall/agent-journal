<?php

declare(strict_types=1);

namespace Domain\Access\Commands\RevokeEnvironmentAccess;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Access\Policies\EnvironmentAccessPolicy;

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
