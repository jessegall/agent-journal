<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Enums\Hosts\HostProcessPurpose;
use RuntimeException;

/**
 * No program driver drives processes of this purpose, so no worker can be started for one.
 */
final class ProgramDriverMissing extends RuntimeException
{
    public static function forPurpose(HostProcessPurpose $purpose): self
    {
        return new self("No program driver drives {$purpose->value} processes.");
    }
}
