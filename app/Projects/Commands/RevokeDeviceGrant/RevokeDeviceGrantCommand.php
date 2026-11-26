<?php

declare(strict_types=1);

namespace App\Projects\Commands\RevokeDeviceGrant;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ConnectionsPolicy;
use App\Support\Command;

/**
 * The owner revokes a device grant; the binding stays connected.
 *
 * @extends Command<null>
 */
#[Authorize(ConnectionsPolicy::class, AccessType::Edit)]
final readonly class RevokeDeviceGrantCommand extends Command
{
    public function __construct(public string $id) {}
}
