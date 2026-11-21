<?php

declare(strict_types=1);

namespace App\Agents\Enums;

use App\Agents\Exceptions\AccountContainerUnsupported;
use App\Agents\Exceptions\ContainerUnavailable;
use App\Agents\Exceptions\HostCapabilityUnsupported;
use App\Agents\Support\HostCapability;

/**
 * What a start needs the host and the program to do: reach the provider without a credential, keep hook callbacks
 * apart from MCP and tools, keep relay material from the model, track every descendant, fence completion, and keep the
 * Stop hook's deadline and continuation behaviour.
 */
enum HostCapabilityType: string
{
    case AccountTransport = 'account-transport';
    case CallbackSeparation = 'callback-separation';
    case RelayProtection = 'relay-protection';
    case ProcessTracking = 'process-tracking';
    case CompletionFence = 'completion-fence';
    case StopDeadline = 'stop-deadline';
    case ContainerRuntime = 'container-runtime';
    case AccountIsolation = 'account-isolation';

    /**
     * The refusal of a start that needs this capability where the evidence does not prove it.
     */
    public function refusalFor(
        HostCapability $capability,
    ): AccountContainerUnsupported|ContainerUnavailable|HostCapabilityUnsupported {
        return match ($this) {
            self::AccountTransport => AccountContainerUnsupported::for($capability),
            self::ContainerRuntime => ContainerUnavailable::because($capability->reason),
            default => HostCapabilityUnsupported::for($capability),
        };
    }
}
