<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Values\DriverKey;
use RuntimeException;

/**
 * A driver the journal has no proven way to hand skills to.
 */
final class DriverSkillsUnsupported extends RuntimeException implements CodedRefusal
{
    public static function for(DriverKey $driver): self
    {
        return new self("The journal cannot deliver skills to the driver {$driver->key}.");
    }

    public static function forNamed(string $name): self
    {
        return new self("The journal cannot deliver skills to the driver {$name}.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Unavailable;
    }
}
