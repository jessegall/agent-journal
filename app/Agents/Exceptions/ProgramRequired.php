<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\StartRefusalType;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A start with no program from the caller, its profile or its parent session.
 */
final class ProgramRequired extends InvalidArgumentException implements CommandRefusal
{
    public static function forStart(): self
    {
        return new self('Name a program for this main-agent start, or select a profile that defines one.');
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::ProgramRequired;
    }
}
