<?php

declare(strict_types=1);

namespace App\Commands\Access\DisableUser;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\EnvironmentAccessPolicy;
use App\Support\Command;

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
