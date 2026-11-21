<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Contracts\StartRefusal;
use App\Agents\Enums\StartRefusalType;
use RuntimeException;

/**
 * A required container start on a host whose container runtime is not proven; it never falls back to the host.
 */
final class ContainerUnavailable extends RuntimeException implements StartRefusal
{
    public static function because(string $reason): self
    {
        return new self("This host cannot start a required container: {$reason} Nothing was started.");
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::ContainerUnavailable;
    }
}
