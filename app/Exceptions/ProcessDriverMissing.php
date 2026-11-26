<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Enums\Hosts\HostProcessPurpose;
use RuntimeException;

/**
 * No process driver drives processes of this purpose, so no worker can be started for one.
 */
final class ProcessDriverMissing extends RuntimeException
{
    public static function forPurpose(HostProcessPurpose $purpose): self
    {
        return new self("No process driver drives {$purpose->value} processes.");
    }
}
