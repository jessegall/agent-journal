<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Hosts\Exceptions\HostAnswerAwaitedInTransaction;
use App\Models\Hosts\HostOrder;
use App\Time\Contracts\ServerClock;
use Illuminate\Database\DatabaseManager;

/**
 * Waits for the host's answer to an order, outside every transaction, for the console or controller that submitted
 * the command: the command only records the order and commits, the host claims and answers it, and this reads the
 * answer. An order of a process is heard on that process's feed; a host-wide order is read from its row.
 */
final readonly class HostAnswers
{
    /**
     * How often a host-wide order's row is read again while no feed tells of its answer.
     */
    private const int POLL_MS = 100;

    public function __construct(
        private ProcessFeed $feed,
        private DatabaseManager $databases,
        private ServerClock $clock,
    ) {}

    /**
     * The order as the host answered it, or as it still stands once the milliseconds or the order's expiry passed.
     *
     * @throws HostAnswerAwaitedInTransaction
     */
    public function await(string $orderId, int $waitMs): HostOrder
    {
        $level = $this->databases->connection()->transactionLevel();

        if ($level > 0) {
            throw HostAnswerAwaitedInTransaction::atLevel($orderId, $level);
        }

        // The wait is measured on this machine's monotonic clock, which moves even where the server clock is held.
        $deadline = hrtime(true) + $waitMs * 1_000_000;
        $order = HostOrder::query()->whereKey($orderId)->sole();
        $process = $order->host_process_id;
        $cursor = $process === null ? null : $this->feed->lastCursor(ProcessFeed::streamKey($process));

        while ($this->isWaiting($order->refresh(), $deadline)) {
            $leftMs = intdiv($deadline - hrtime(true), 1_000_000);
            $cursor = $this->waitForNews($order, $cursor, max(1, min(self::POLL_MS, $leftMs)));
        }

        return $order;
    }

    private function isWaiting(HostOrder $order, int $deadline): bool
    {
        return $order->isOpen() && hrtime(true) < $deadline && $this->clock->now()->lessThan($order->expires_at);
    }

    /**
     * Waits on the process's feed for the next entry, or a short while for a host-wide order, and answers where the
     * feed was read to.
     */
    private function waitForNews(HostOrder $order, string|null $cursor, int $waitMs): string|null
    {
        if ($order->host_process_id === null || $cursor === null) {
            usleep($waitMs * 1000);

            return $cursor;
        }

        $entries = $this->feed->after($order->host_process_id, $cursor, $waitMs);

        if ($entries === []) {
            return $cursor;
        }

        return $entries[array_key_last($entries)]->cursor;
    }
}
