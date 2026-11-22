<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Drivers\Values\DriverKey;
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

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Unavailable;
    }
}
