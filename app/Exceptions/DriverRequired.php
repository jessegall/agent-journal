<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\StartRefusal;
use App\Enums\StartRefusalType;
use InvalidArgumentException;

/**
 * A start with no driver from the caller, its profile or its parent session.
 */
final class DriverRequired extends InvalidArgumentException implements StartRefusal
{
    public static function forStart(): self
    {
        return new self('Name a driver for this main-agent start, or select a profile that defines one.');
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::DriverRequired;
    }
}
