<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\DriverVariant;
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

    public static function forStart(string $driver, DriverVariant $variant): self
    {
        return new self(
            "No connected host runs {$driver} as a {$variant->value} start. Connect a host that runs it, then start again.",
        );
    }

    public static function withoutStartFolder(string $hostId): self
    {
        return new self("The host {$hostId} has no folder it may start agents in.");
    }
}
