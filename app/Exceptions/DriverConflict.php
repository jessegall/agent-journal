<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Refusals\StartRefusal;
use App\Enums\StartRefusalType;
use InvalidArgumentException;

/**
 * A driver the caller named that the profile's pinned driver forbids.
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
