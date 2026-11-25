<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Refusals\StartRefusal;
use App\Enums\Sessions\StartRefusalType;
use App\Support\HostCapability;
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
