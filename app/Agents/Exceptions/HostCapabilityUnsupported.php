<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\LaunchRefusalType;
use App\Agents\Support\HostCapability;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A launch whose configured guarantee needs a host or program capability the recorded evidence does not prove;
 * it is refused before any work starts.
 */
final class HostCapabilityUnsupported extends RuntimeException implements CommandRefusal
{
    public static function for(HostCapability $capability): self
    {
        return new self(
            "The journal cannot guarantee {$capability->query->describe()}: {$capability->reason} Nothing was "
                .'launched.',
        );
    }

    public function reason(): LaunchRefusalType
    {
        return LaunchRefusalType::CapabilityUnsupported;
    }
}
