<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\ApproveDeviceGrant;
use App\Connections\Enums\ConnectionAuditActor;
use App\Connections\Enums\ConnectionAuditType;
use App\Connections\Models\ConnectionAudit;
use App\Connections\Models\DeviceGrant;
use App\Contracts\CommandHandler;

final readonly class ApproveDeviceGrantHandler implements CommandHandler
{
    public function handle(ApproveDeviceGrant $command): void
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
