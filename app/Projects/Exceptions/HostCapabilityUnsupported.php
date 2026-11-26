<?php

declare(strict_types=1);

namespace App\Projects\Exceptions;

use App\Contracts\Refusals\StartRefusal;
use App\Hosts\HostCapability;
use App\Sessions\Enums\StartRefusalType;
use RuntimeException;

/**
 * A start whose configured guarantee needs a host or driver capability the recorded evidence does not prove;
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
