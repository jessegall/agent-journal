<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\StartDeviceGrant;
use App\Connections\Exceptions\PresenceRefused;
use App\Connections\Models\DeviceGrant;
use App\Connections\Models\ProjectBinding;
use App\Connections\Values\DeviceGrantStart;
use App\Contracts\CommandHandler;

/**
 * Starts a device grant for the binding when the calling host is the binding's own and the binding is not revoked.
 */
final readonly class StartDeviceGrantHandler implements CommandHandler
{
    public function handle(StartDeviceGrant $command): DeviceGrantStart
    {
        $binding = ProjectBinding::lockById($command->bindingId);

        if (! $binding->isReportableBy($command->hostId)) {
            throw PresenceRefused::notTheHost($binding->id);
        }

        $grant = DeviceGrant::create($binding, $command->deviceCodeDigest, $command->userCode);

        return new DeviceGrantStart($grant->user_code, $grant->code_expires_at->toIso8601String());
    }
}
