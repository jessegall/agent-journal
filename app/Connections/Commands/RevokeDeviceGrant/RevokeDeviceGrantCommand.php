<?php

declare(strict_types=1);

namespace App\Connections\Commands\RevokeDeviceGrant;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Connections\Policies\ConnectionsPolicy;
use App\Operations\Enums\AccessType;

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
