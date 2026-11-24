<?php

declare(strict_types=1);

namespace App\Commands\Projects\PollDeviceGrant;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\DeviceGrantRefused;
use App\Models\Projects\DeviceGrant;
use App\Values\DevicePollOutcome;

/**
 * Answers a terminal's poll with one outcome: a code of another host's binding is unknown; a grant past its approval
 * is already issued or revoked; an expired code is expired; a poll sooner than allowed slows down without moving the
 * last one; an unapproved one awaits approval; an approved one is issued once and answers its reference.
 */
final readonly class PollDeviceGrantHandler implements CommandHandler
{
    public function handle(PollDeviceGrantCommand $command): DevicePollOutcome
    {
        $grant = DeviceGrant::lockByDeviceCode($command->deviceCodeDigest);

        if ($grant->binding->host_id !== $command->hostId) {
            throw DeviceGrantRefused::unknownCode();
        }

        $grant->assertNotCollected();

        if ($grant->isCodeExpired()) {
            throw DeviceGrantRefused::expired();
        }

        $grant->recordPoll();

        // A poll before the owner approved is kept, so the next one sooner than the interval slows down.
        if (! $grant->isApproved()) {
            return new DevicePollOutcome(DevicePollOutcome::PENDING, (string) $grant->reference);
        }

        $grant->issue($command->grantDigest);

        return new DevicePollOutcome(DevicePollOutcome::ISSUED, (string) $grant->reference);
    }
}
