<?php

declare(strict_types=1);

namespace Domain\Access\Commands\DisableUser;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Access\Policies\EnvironmentAccessPolicy;

/**
 * The owner disables a user account so it is admitted nowhere, and every chat of the user ends for it.
 *
 * @extends Command<null>
 */
#[Authorize(EnvironmentAccessPolicy::class, AccessType::Edit)]
final readonly class DisableUserCommand extends Command
{
    public function __construct(public string $userId) {}
}
