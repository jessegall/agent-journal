<?php

declare(strict_types=1);

namespace App\Access\Commands\RevokeEnvironmentAccess;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\EnvironmentAccessPolicy;
use App\Support\Command;

/**
 * The owner revokes a user's grant to an environment's inboxes, and every inbox the user lost there ends for it.
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
