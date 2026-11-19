<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\StartRefusalType;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A required container start the host has no room left for; it is refused rather than overcommitted.
 */
final class CapacityUnavailable extends RuntimeException implements CommandRefusal
{
    public static function because(string $reason): self
    {
        return new self("The host has no capacity left for this start: {$reason} Nothing was started.");
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::CapacityUnavailable;
    }
}
