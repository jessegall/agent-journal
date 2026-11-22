<?php

declare(strict_types=1);

namespace App\Commands\RevokeDeviceGrant;

use App\Contracts\CommandHandler;
use App\Enums\ConnectionAuditActor;
use App\Enums\ConnectionAuditType;
use App\Models\ConnectionAudit;
use App\Models\DeviceGrant;

final readonly class RevokeDeviceGrantHandler implements CommandHandler
{
    public function handle(RevokeDeviceGrantCommand $command): void
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
