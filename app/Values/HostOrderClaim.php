<?php

declare(strict_types=1);

namespace App\Values;

use JsonSerializable;

/**
 * What a host's claim answers: the orders it takes now, and how long it may go without calling before it is taken
 * as idle.
 */
final readonly class HostOrderClaim implements JsonSerializable
{
    /**
     * How long a host may go without a call before the journal takes it as idle.
     */
    public const int IDLE_WINDOW_SECONDS = 600;

    /**
     * @param  list<ClaimedHostOrder>  $orders
     */
    public function __construct(public array $orders) {}

    public function isEmpty(): bool
    {
        return $this->orders === [];
    }

    /**
     * @return array{orders: list<ClaimedHostOrder>, idle_window_s: int}
     */
    public function jsonSerialize(): array
    {
        return ['orders' => $this->orders, 'idle_window_s' => self::IDLE_WINDOW_SECONDS];
    }
}
