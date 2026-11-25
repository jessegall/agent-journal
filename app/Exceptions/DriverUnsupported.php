<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Refusals\StartRefusal;
use App\Enums\Starts\StartRefusalType;
use InvalidArgumentException;

/**
 * A driver name the journal has no adapter for.
 */
final class DriverUnsupported extends InvalidArgumentException implements StartRefusal
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
