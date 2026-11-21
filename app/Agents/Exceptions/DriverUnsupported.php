<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\StartRefusalType;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A program name the journal has no adapter for.
 */
final class DriverUnsupported extends InvalidArgumentException implements CommandRefusal
{
    public static function for(string $driver): self
    {
        return new self("The journal cannot run the driver {$driver}. Name claude-code or codex.");
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::DriverUnsupported;
    }
}
