<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\LaunchRefusalType;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A required container launch on a host whose container runtime is not proven; it never falls back to the host.
 */
final class ContainerUnavailable extends RuntimeException implements CommandRefusal
{
    public static function because(string $reason): self
    {
        return new self("This host cannot start a required container: {$reason} Nothing was launched.");
    }

    public function reason(): LaunchRefusalType
    {
        return LaunchRefusalType::ContainerUnavailable;
    }
}
