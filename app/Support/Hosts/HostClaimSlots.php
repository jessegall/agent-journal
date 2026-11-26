<?php

declare(strict_types=1);

namespace App\Support\Hosts;

use Illuminate\Contracts\Redis\Factory as RedisFactory;
use Illuminate\Redis\Connections\Connection;
use Illuminate\Support\Str;

/**
 * One long poll per host at a time: the host's newest claim holds the slot, and one it left behind gives way, so no
 * two claims of a host wait at once and a host that lost its connection claims again at once.
 */
final readonly class HostClaimSlots
{
    /**
     * How long a slot outlives a claim that never gave it back, longer than the longest wait.
     */
    public const int SLOT_SECONDS = 40;

    public function __construct(private RedisFactory $redis) {}

    /**
     * The host's newest claim takes its slot and answers the token it holds it by; a claim the host left behind, as
     * when its connection or the journal died, holds it no longer.
     */
    public function take(string $hostId): string
    {
        $token = Str::random(16);

        $this->connection()->command('set', [self::key($hostId), $token, ['ex' => self::SLOT_SECONDS]]);

        return $token;
    }

    /**
     * Whether a claim of the host holds the slot now.
     */
    public function isTaken(string $hostId): bool
    {
        return $this->connection()->get(self::key($hostId)) !== null;
    }

    /**
     * Whether the claim holding the token is still the host's newest.
     */
    public function isHeldBy(string $hostId, string $token): bool
    {
        return $this->connection()->get(self::key($hostId)) === $token;
    }

    /**
     * Gives the slot back, unless a newer claim of the host took it already.
     */
    public function release(string $hostId, string $token): void
    {
        if ($this->isHeldBy($hostId, $token)) {
            $this->connection()->del(self::key($hostId));
        }
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
