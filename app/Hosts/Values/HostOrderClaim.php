<?php

declare(strict_types=1);

namespace App\Hosts\Values;

use App\Hosts\Protocol\Data\HostClaimedOrdersData;
use App\Hosts\Protocol\Data\HostOrderData;

/**
 * What a host's claim answers: the orders it takes now, how long it may go without calling before it is taken as
 * idle, and the journal's time, by which the host judges each order's expiry whatever its own clock says.
 */
final readonly class HostOrderClaim
{
    /**
     * @param  list<HostOrderData>  $orders
     * @param  int|null  $retakeableInSeconds  when an order the host claimed and left unanswered may be handed out
     *                                         again; null when it holds none
     * @param  int  $idleWindowSeconds  how long a host that holds no live process stays online
     */
    public function __construct(
        public array $orders,
        public string $now,
        public int|null $retakeableInSeconds,
        public int $idleWindowSeconds,
    ) {}

    public function isEmpty(): bool
    {
        return $this->orders === [];
    }

    /**
     * How long a claim that found nothing may wait for a wake: no longer than asked, and no longer than until an
     * unanswered order may be handed out again.
     */
    public function waitSeconds(int $asked): int
    {
        return min($asked, $this->retakeableInSeconds ?? $asked);
    }

    /**
     * The claim as the journal answers the host's claim_orders call with it.
     */
    public function reply(): HostClaimedOrdersData
    {
        return HostClaimedOrdersData::from([
            'orders' => $this->orders,
            'idle_window_seconds' => $this->idleWindowSeconds,
            'now' => $this->now,
        ]);
    }
}
