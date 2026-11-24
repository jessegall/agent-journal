<?php

declare(strict_types=1);

namespace App\Commands\Projects\StartDeviceGrant;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\DeviceGrantRefused;
use App\Exceptions\PresenceRefused;
use App\Models\Projects\DeviceGrant;
use App\Models\Projects\ProjectBinding;
use App\Values\DeviceGrantStart;

/**
 * Starts a device grant for the binding when the calling host is the binding's own and the binding is not revoked. A
 * start sent again under its key finds the grant it made: a pending one takes the new device code, one past its
 * approval answers what came of it.
 */
final readonly class StartDeviceGrantHandler implements CommandHandler
{
    public function handle(StartDeviceGrantCommand $command): DeviceGrantStart
    {
        $binding = ProjectBinding::lockById($command->bindingId);

        if (! $binding->isReportableBy($command->hostId)) {
            throw PresenceRefused::notTheHost($binding->id);
        }

        $grant = $this->grantOf($binding, $command);

        return new DeviceGrantStart(
            (string) $grant->reference,
            $grant->generation,
            $grant->user_code,
            $grant->code_expires_at->toIso8601String(),
        );
    }

    /**
     * @throws DeviceGrantRefused
     */
    private function grantOf(ProjectBinding $binding, StartDeviceGrantCommand $command): DeviceGrant
    {
        foreach (DeviceGrant::lockOfStart($binding, $command->startKey) as $earlier) {
            $earlier->assertNotCollected();
            $earlier->restartWith($command->deviceCodeDigest);

            return $earlier;
        }

        return DeviceGrant::create($binding, $command->deviceCodeDigest, $command->userCode, $command->startKey);
    }
}
