<?php

declare(strict_types=1);

namespace App\Commands\Projects\RevokeDeviceGrant;

use App\Attributes\Authorize;
use App\Enums\AccessType;
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
