<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\RevokeDeviceGrant;
use App\Connections\Enums\ConnectionAuditActor;
use App\Connections\Enums\ConnectionAuditType;
use App\Connections\Models\ConnectionAudit;
use App\Connections\Models\DeviceGrant;
use App\Contracts\CommandHandler;

final readonly class RevokeDeviceGrantHandler implements CommandHandler
{
    public function handle(RevokeDeviceGrant $command): void
    {
        $grant = DeviceGrant::lockById($command->id);
        $grant->revoke();

        ConnectionAudit::ofBinding(
            ConnectionAuditType::DeviceRevoked,
            ConnectionAuditActor::User,
            $command->dispatchedBy()->actorId(),
            $grant->binding,
        );
    }
}
