<?php

declare(strict_types=1);

namespace App\Projects\Commands\RevokeDeviceGrant;

use App\Bus\Contracts\CommandHandler;
use App\Connections\Enums\ConnectionAuditActor;
use App\Connections\Enums\ConnectionAuditType;
use App\Models\Projects\ConnectionAudit;
use App\Models\Projects\DeviceGrant;

final readonly class RevokeDeviceGrantHandler implements CommandHandler
{
    public function handle(RevokeDeviceGrantCommand $command): void
    {
        $grant = DeviceGrant::findLockedById($command->id);
        $grant->revoke();

        ConnectionAudit::createForBinding(
            ConnectionAuditType::DeviceRevoked,
            ConnectionAuditActor::User,
            $command->dispatchedBy()->actorId(),
            $grant->binding,
        );
    }
}
