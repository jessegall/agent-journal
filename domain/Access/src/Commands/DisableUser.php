<?php

declare(strict_types=1);

namespace Domain\Access\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Access\Policies\EnvironmentAccessPolicy;

/**
 * The owner disables a user account so it is admitted nowhere, and every chat of the user ends for it.
 *
 * @extends Command<null>
 */
#[Authorize(EnvironmentAccessPolicy::class, AccessType::Edit)]
final readonly class DisableUser extends Command
{
    public function __construct(public string $userId) {}
}
