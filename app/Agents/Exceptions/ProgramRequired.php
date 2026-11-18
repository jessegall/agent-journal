<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\LaunchRefusalType;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A launch with no program from the caller, its profile or its parent session.
 */
final class ProgramRequired extends InvalidArgumentException implements CommandRefusal
{
    public static function forLaunch(): self
    {
        return new self('Name a program for this main-agent launch, or select a profile that defines one.');
    }

    public function reason(): LaunchRefusalType
    {
        return LaunchRefusalType::ProgramRequired;
    }
}
