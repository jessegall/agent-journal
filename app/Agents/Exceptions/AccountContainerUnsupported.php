<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\LaunchRefusalType;
use App\Agents\Support\HostCapability;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A launch whose program, account and execution mode the recorded evidence does not prove; no process is released,
 * no account is changed and nothing falls back to the host or to API billing.
 */
final class AccountContainerUnsupported extends RuntimeException implements CommandRefusal
{
    public static function for(HostCapability $capability): self
    {
        return new self("The journal cannot launch {$capability->query->describe()}: {$capability->reason} Nothing was launched.");
    }

    public function reason(): LaunchRefusalType
    {
        return LaunchRefusalType::AccountContainerUnsupported;
    }
}
