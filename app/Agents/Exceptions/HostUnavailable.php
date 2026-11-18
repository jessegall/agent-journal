<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A runtime asked on a host that is not enrolled or was revoked; nothing falls back to another host.
 */
final class HostUnavailable extends RuntimeException implements CommandRefusal
{
    public static function forHost(string $hostId): self
    {
        return new self("The host {$hostId} is not available to run agents.");
    }
}
