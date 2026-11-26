<?php

declare(strict_types=1);

namespace App\Support\Hosts;

use Illuminate\Contracts\Redis\Factory as RedisFactory;
use Illuminate\Redis\Connections\Connection;

/**
 * The wakes a host's claim and a runtime's worker block on: a host is woken when an order for it is made, a worker when
 * a driver request for its runtime is made. Nothing polls on a timer.
 */
final readonly class HostWake
{
    /**
     * How long an unanswered wake is kept; a claim or worker that starts later finds the work in the database anyway.
     */
    public const int WAKE_SECONDS = 60;

    /**
     * The most wakes of a runtime kept in its stream.
     */
    public const int RUNTIME_WAKE_LIMIT = 64;

    public function __construct(private RedisFactory $redis) {}

    public function wakeHost(string $hostId): void
    {
        $key = self::hostKey($hostId);
        $this->connection()->rpush($key, '1');
        $this->connection()->expire($key, self::WAKE_SECONDS);
    }

    /**
     * Blocks until the host is woken or the seconds pass, and answers whether it was woken; the wakes waiting are taken
     * together, as one claim answers every order made before it.
     */
    public function waitForHost(string $hostId, int $seconds): bool
    {
        $key = self::hostKey($hostId);
        $woken = $this->connection()->blpop([$key], $seconds);
        $this->connection()->del($key);

        return $woken !== null && $woken !== [] && $woken !== false;
    }

    public function wakeRuntime(string $runtimeId): void
    {
        $key = self::runtimeKey($runtimeId);
        $this->connection()->xadd($key, '*', ['wake' => 'request'], self::RUNTIME_WAKE_LIMIT, true);
        $this->connection()->expire($key, ProcessFeed::TTL_SECONDS);
    }

    public static function hostKey(string $hostId): string
    {
        return "host:wake:{$hostId}";
    }

    public static function runtimeKey(string $runtimeId): string
    {
        return "driver:wake:{$runtimeId}";
    }

    private function connection(): Connection
    {
        return $this->redis->connection();
    }
}
