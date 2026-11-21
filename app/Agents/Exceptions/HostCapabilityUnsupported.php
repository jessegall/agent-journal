<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Contracts\StartRefusal;
use App\Agents\Enums\StartRefusalType;
use App\Agents\Support\HostCapability;
use RuntimeException;

/**
 * A start whose configured guarantee needs a host or program capability the recorded evidence does not prove;
 * it is refused before any work starts.
 */
final class HostCapabilityUnsupported extends RuntimeException implements StartRefusal
{
    public static function for(HostCapability $capability): self
    {
        return new self(
            sprintf(
                'The journal cannot guarantee %s: %s Nothing was started.',
                $capability->query->describe(),
                $capability->reason,
            ),
        );
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::CapabilityUnsupported;
    }
}
