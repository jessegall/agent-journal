<?php

declare(strict_types=1);

namespace App\Connections\Commands\ApproveDeviceGrant;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Connections\Policies\ConnectionsPolicy;
use App\Operations\Enums\AccessType;

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
