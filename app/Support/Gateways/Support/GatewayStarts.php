<?php

declare(strict_types=1);

namespace App\Support\Gateways\Support;

use App\Enums\GatewayAddressCheck;
use App\Exceptions\GatewayOpenFailed;
use App\Support\GatewayEndpoint;
use App\Support\GatewayOperation;
use Closure;
use Illuminate\Contracts\Process\InvokedProcess;

/**
 * Opens a gateway endpoint from a program a gateway started: it looks for the program's address until the gateway
 * confirms it, the program exits or a minute passes, with one last look at what it printed; then keeps the program for
 * the run and answers the endpoint, or
 * stops it and refuses. A gateway brings only how to start its program and how to read its address.
 */
final readonly class GatewayStarts
{
    private const int CONNECT_SECONDS = 60;

    private const int LOOK_MICROSECONDS = 200_000;

    public function __construct(private GatewayChildren $children) {}

    /**
     * @param  Closure(InvokedProcess): GatewayAddressCheck  $checkAddress
     *
     * @throws GatewayOpenFailed
     */
    public function open(
        string $gatewayKey,
        GatewayOperation $operation,
        InvokedProcess $child,
        Closure $checkAddress,
    ): GatewayEndpoint {
        $deadline = time() + self::CONNECT_SECONDS;
        $seen = $checkAddress($child);

        while ($seen === GatewayAddressCheck::Waiting && $child->running() && time() < $deadline) {
            usleep(self::LOOK_MICROSECONDS);
            $seen = $checkAddress($child);
        }

        if ($seen === GatewayAddressCheck::Waiting) {
            $seen = $checkAddress($child);
        }

        if ($seen !== GatewayAddressCheck::Confirmed) {
            $this->children->end($child);

            throw $seen === GatewayAddressCheck::Unexpected
                ? GatewayOpenFailed::unexpectedAddress($gatewayKey)
                : GatewayOpenFailed::noAddressInTime(
                    $gatewayKey,
                    self::CONNECT_SECONDS,
                );
        }

        $endpoint = GatewayEndpoint::forOperation($operation);
        $this->children->keep($endpoint->processReference, $child);

        return $endpoint;
    }
}
