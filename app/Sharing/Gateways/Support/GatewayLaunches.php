<?php

declare(strict_types=1);

namespace App\Sharing\Gateways\Support;

use App\Sharing\Enums\GatewayAddressCheck;
use App\Sharing\Exceptions\GatewayOpenFailed;
use App\Sharing\Support\GatewayEndpoint;
use App\Sharing\Support\GatewayOperation;
use Closure;
use Illuminate\Contracts\Process\InvokedProcess;

/**
 * Opens a gateway endpoint from a program a gateway started: it looks for the program's address until the gateway
 * confirms it, the program exits or a minute passes, with one last look at what it printed; then keeps the program for
 * the run and answers the endpoint, or
 * stops it and refuses. A gateway brings only how to start its program and how to read its address.
 */
final readonly class GatewayLaunches
{
    private const int CONNECT_SECONDS = 60;

    private const int LOOK_MICROSECONDS = 200_000;

    public function __construct(private GatewayChildren $children) {}

    /**
     * @param  Closure(InvokedProcess): GatewayAddressCheck  $look
     *
     * @throws GatewayOpenFailed
     */
    public function open(
        string $gatewayKey,
        GatewayOperation $operation,
        InvokedProcess $child,
        Closure $look,
    ): GatewayEndpoint {
        $deadline = time() + self::CONNECT_SECONDS;
        $seen = $look($child);

        while ($seen === GatewayAddressCheck::Waiting && $child->running() && time() < $deadline) {
            usleep(self::LOOK_MICROSECONDS);
            $seen = $look($child);
        }

        if ($seen === GatewayAddressCheck::Waiting) {
            $seen = $look($child);
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
