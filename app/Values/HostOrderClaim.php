<?php

declare(strict_types=1);

namespace App\Values;

use JsonSerializable;

/**
 * What a host's claim answers: the orders it takes now, how long it may go without calling before it is taken as
 * idle, and the journal's time, by which the host judges each order's expiry whatever its own clock says.
 */
final readonly class HostOrderClaim implements JsonSerializable
{
    /**
     * @param  list<ClaimedHostOrder>  $orders
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
     * @return array{orders: list<ClaimedHostOrder>, idle_window_s: int, now: string}
     */
    public function jsonSerialize(): array
    {
        return [
            'orders' => $this->orders,
            'idle_window_s' => $this->idleWindowSeconds,
            'now' => $this->now,
        ];
    }
}
