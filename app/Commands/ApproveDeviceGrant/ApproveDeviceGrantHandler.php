<?php

declare(strict_types=1);

namespace App\Commands\ApproveDeviceGrant;

use App\Contracts\Bus\CommandHandler;
use App\Enums\ConnectionAuditActor;
use App\Enums\ConnectionAuditType;
use App\Models\ConnectionAudit;
use App\Models\DeviceGrant;

final readonly class ApproveDeviceGrantHandler implements CommandHandler
{
    public function handle(ApproveDeviceGrantCommand $command): void
    {
        $grant = DeviceGrant::lockPendingByUserCode($command->userCode);
        $userId = $command->dispatchedBy()->actorId();
        $grant->approveBy($userId);

        ConnectionAudit::ofBinding(
            ConnectionAuditType::DeviceApproved,
            ConnectionAuditActor::User,
            $userId,
            $grant->binding,
        );
    }
}
