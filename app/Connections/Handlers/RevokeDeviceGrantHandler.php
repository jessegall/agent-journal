<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\RevokeDeviceGrant;
use App\Connections\Models\DeviceGrant;
use App\Contracts\CommandHandler;

final readonly class RevokeDeviceGrantHandler implements CommandHandler
{
    public function handle(RevokeDeviceGrant $command): void
    {
        DeviceGrant::lockById($command->grantId)->revoke();
    }
}
