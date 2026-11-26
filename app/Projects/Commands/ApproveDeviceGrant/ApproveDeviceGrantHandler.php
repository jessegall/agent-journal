<?php

declare(strict_types=1);

namespace App\Projects\Commands\ApproveDeviceGrant;

use App\Bus\Contracts\CommandHandler;
use App\Connections\Enums\ConnectionAuditActor;
use App\Connections\Enums\ConnectionAuditType;
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
