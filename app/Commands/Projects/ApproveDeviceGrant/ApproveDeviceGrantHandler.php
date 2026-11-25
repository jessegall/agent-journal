<?php

declare(strict_types=1);

namespace App\Commands\Projects\ApproveDeviceGrant;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Connections\ConnectionAuditActor;
use App\Enums\Connections\ConnectionAuditType;
use App\Models\Projects\ConnectionAudit;
use App\Models\Projects\DeviceGrant;

final readonly class ApproveDeviceGrantHandler implements CommandHandler
{
    public function handle(ApproveDeviceGrantCommand $command): void
    {
        $grant = DeviceGrant::findLockedPendingByUserCode($command->userCode);
        $userId = $command->dispatchedBy()->actorId();
        $grant->approveBy($userId);

        ConnectionAudit::createForBinding(
            ConnectionAuditType::DeviceApproved,
            ConnectionAuditActor::User,
            $userId,
            $grant->binding,
        );
    }
}
