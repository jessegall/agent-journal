<?php

declare(strict_types=1);

namespace App\Projects\Exceptions;

use App\Contracts\Refusals\StartRefusal;
use App\Hosts\HostCapability;
use App\Sessions\Enums\StartRefusalType;
use RuntimeException;

/**
 * A start whose driver, account and execution mode the recorded evidence does not prove; no process is released,
 * no account is changed and nothing falls back to the host or to API billing.
 */
final class AccountContainerUnsupported extends RuntimeException implements StartRefusal
{
    public static function for(HostCapability $capability): self
    {
        return new self(
            "The journal cannot start {$capability->query->describe()}: {$capability->reason} Nothing was started.",
        );
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::AccountContainerUnsupported;
    }
}
