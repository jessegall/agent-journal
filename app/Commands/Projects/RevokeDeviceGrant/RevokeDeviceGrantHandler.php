<?php

declare(strict_types=1);

namespace App\Commands\Projects\RevokeDeviceGrant;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Connections\ConnectionAuditActor;
use App\Enums\Connections\ConnectionAuditType;
use App\Models\Projects\ConnectionAudit;
use App\Models\Projects\DeviceGrant;

final readonly class RevokeDeviceGrantHandler implements CommandHandler
{
    public function handle(RevokeDeviceGrantCommand $command): void
    {
        $grant = DeviceGrant::lockById($command->id);
        $grant->revoke();

        ConnectionAudit::createForBinding(
            ConnectionAuditType::DeviceRevoked,
            ConnectionAuditActor::User,
            $command->dispatchedBy()->actorId(),
            $grant->binding,
        );
    }
}
