<?php

declare(strict_types=1);

namespace App\Support\Hosts;

use Illuminate\Contracts\Redis\Factory as RedisFactory;
use Illuminate\Redis\Connections\Connection;

/**
 * One long poll per host at a time: a second claim while the first waits would hold another server thread and
 * database connection for nothing.
 */
final readonly class HostClaimSlots
{
    /**
     * How long a slot outlives a claim that never gave it back, longer than the longest wait.
     */
    public const int SLOT_SECONDS = 40;

    public function __construct(private RedisFactory $redis) {}

    /**
     * Takes the host's slot and answers whether it was free.
     */
    public function take(string $hostId): bool
    {
        return (bool) $this->connection()->set(self::key($hostId), '1', 'EX', self::SLOT_SECONDS, 'NX');
    }

    public function release(string $hostId): void
    {
        $this->connection()->del(self::key($hostId));
    }

    private static function key(string $hostId): string
    {
        return "host:claim:{$hostId}";
    }

    private function connection(): Connection
    {
        return $this->redis->connection();
    }
}
