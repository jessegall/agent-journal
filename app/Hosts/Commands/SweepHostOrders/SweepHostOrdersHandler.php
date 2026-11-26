<?php

declare(strict_types=1);

namespace App\Hosts\Commands\SweepHostOrders;

use App\Bus\Contracts\CommandHandler;
use App\Models\Hosts\HostOrder;
use App\Time\Contracts\ServerClock;

/**
 * Refuses the orders that expired unclaimed or unanswered, and prunes answered ones after an hour.
 */
final readonly class SweepHostOrdersHandler implements CommandHandler
{
    /**
     * How long an answered order is kept, for a worker that takes a process over to read where it stood.
     */
    public const int RETENTION_SECONDS = 3600;

    /**
     * The most orders one sweep expires.
     */
    public const int SWEEP_LIMIT = 500;

    public function __construct(private ServerClock $clock) {}

    public function handle(SweepHostOrdersCommand $command): void
    {
        $now = $this->clock->now();

        foreach (HostOrder::findExpiredAt($now, self::SWEEP_LIMIT) as $order) {
            $order->expire($now);
        }

        HostOrder::query()->answeredBefore($now->subSeconds(self::RETENTION_SECONDS))->delete();
    }
}
