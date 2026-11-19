<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\StartRefusalType;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A program the caller named that the profile's pinned program forbids.
 */
final class ProgramConflict extends InvalidArgumentException implements CommandRefusal
{
    public static function for(string $profile, string $program): self
    {
        return new self("Profile {$profile} cannot run on {$program}. Choose a permitted program or profile.");
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::ProgramConflict;
    }
}
