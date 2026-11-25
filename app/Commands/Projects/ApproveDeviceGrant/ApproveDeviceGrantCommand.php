<?php

declare(strict_types=1);

namespace App\Commands\Projects\ApproveDeviceGrant;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\ConnectionsPolicy;
use App\Support\Command;

/**
 * The owner approves a device code after checking its code, binding and scopes.
 *
 * @extends Command<null>
 */
#[Authorize(ConnectionsPolicy::class, AccessType::Edit)]
final readonly class ApproveDeviceGrantCommand extends Command
{
    public function __construct(public string $userCode) {}
}
