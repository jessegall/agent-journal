<?php

declare(strict_types=1);

namespace App\Access\Commands\DisableUser;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\EnvironmentAccessPolicy;
use App\Support\Command;

/**
 * The owner disables a user account so it is admitted nowhere, and every inbox of the user ends for it.
 *
 * @extends Command<null>
 */
#[Authorize(EnvironmentAccessPolicy::class, AccessType::Edit)]
final readonly class DisableUserCommand extends Command
{
    public function __construct(public string $userId) {}
}
