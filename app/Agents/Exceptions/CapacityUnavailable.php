<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\LaunchRefusalType;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A required container launch the host has no room left for; it is refused rather than overcommitted.
 */
final class CapacityUnavailable extends RuntimeException implements CommandRefusal
{
    public static function because(string $reason): self
    {
        return new self("The host has no capacity left for this launch: {$reason} Nothing was launched.");
    }

    public function reason(): LaunchRefusalType
    {
        return LaunchRefusalType::CapacityUnavailable;
    }
}
