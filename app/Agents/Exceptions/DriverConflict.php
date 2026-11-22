<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Contracts\StartRefusal;
use App\Agents\Enums\StartRefusalType;
use InvalidArgumentException;

/**
 * A program the caller named that the profile's pinned program forbids.
 */
final class DriverConflict extends InvalidArgumentException implements StartRefusal
{
    public static function for(string $profile, string $driver): self
    {
        return new self("Profile {$profile} cannot run on {$driver}. Choose a permitted driver or profile.");
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::DriverConflict;
    }
}
