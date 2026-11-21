<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\ApproveDeviceGrant;
use App\Connections\Models\DeviceGrant;
use App\Contracts\CommandHandler;

final readonly class ApproveDeviceGrantHandler implements CommandHandler
{
    public function handle(ApproveDeviceGrant $command): void
    {
        DeviceGrant::lockPendingByUserCode($command->userCode)->approveBy($command->dispatchedBy()->actorId());
    }
}
