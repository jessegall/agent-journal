<?php

declare(strict_types=1);

namespace App\Commands\Hosts\ClaimHostOrders;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Models\Hosts\HostOrder;
use App\Support\Hosts\HostOrderPlacement;
use App\Values\ClaimedHostOrder;
use App\Values\HostOrderClaim;

/**
 * Marks the host's claimable orders claimed and hands each over signed; a host that speaks another protocol is told
 * to update.
 */
final readonly class ClaimHostOrdersHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement, private ServerClock $clock) {}

    public function handle(ClaimHostOrdersCommand $command): HostOrderClaim
    {
        $host = $this->placement->orderingHost($command->hostId);
        $now = $this->clock->now();
        $claimed = [];

        foreach (HostOrder::claimable($host, $now, $command->limit) as $order) {
            $order->claim($now);
            $claimed[] = ClaimedHostOrder::of($order, $host->signOrder($order));
        }

        return new HostOrderClaim($claimed);
    }
}
