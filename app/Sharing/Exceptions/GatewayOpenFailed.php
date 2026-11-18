<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use RuntimeException;

/**
 * A gateway could not open its endpoint: it is not ready, gave no address in time, or gave one other than its fixed
 * public origin. The message names the reason, never a line the program printed.
 */
final class GatewayOpenFailed extends RuntimeException
{
    public static function notReady(string $gatewayKey): self
    {
        return new self("The {$gatewayKey} gateway is not ready to open.");
    }

    public static function noAddressInTime(string $gatewayKey, int $seconds): self
    {
        return new self("The {$gatewayKey} gateway gave no public address within {$seconds} seconds.");
    }

    public static function unexpectedAddress(string $gatewayKey): self
    {
        return new self("The {$gatewayKey} gateway answered with an address other than its fixed public origin.");
    }
}
