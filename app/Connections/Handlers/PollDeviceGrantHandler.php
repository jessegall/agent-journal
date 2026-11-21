<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\PollDeviceGrant;
use App\Connections\Exceptions\DeviceGrantRefused;
use App\Connections\Models\DeviceGrant;
use App\Contracts\CommandHandler;

/**
 * Refuses a code of another host's binding, an expired one and a poll sooner than allowed; issues the grant once the
 * owner approved, else answers that approval is awaited.
 */
final readonly class PollDeviceGrantHandler implements CommandHandler
{
    public function handle(PollDeviceGrant $command): void
    {
        $grant = DeviceGrant::lockByDeviceCode($command->deviceCodeDigest);

        if ($grant->binding->host_id !== $command->hostId || $grant->isCodeExpired()) {
            throw DeviceGrantRefused::unknownCode();
        }

        $grant->recordPoll();

        if (! $grant->isApproved()) {
            throw DeviceGrantRefused::awaitingApproval();
        }

        $grant->issue($command->grantDigest);
    }
}
