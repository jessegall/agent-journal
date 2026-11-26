<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\PrivateValueRefused;
use Illuminate\Contracts\Cache\Repository;

/**
 * A browser writer's private value on its way to the host: kept only in the cache, under its single-use submission
 * id, for at most half a minute, and pulled once by the host its write was ordered on. The request row names the
 * submission alone; the value is never written to the database, a log or a receipt.
 */
final readonly class PrivateValues
{
    /**
     * How long a private value waits for its host before it is gone.
     */
    public const int KEEP_SECONDS = 30;

    public function __construct(private Repository $cache) {}

    public function keep(string $submissionId, string $value): void
    {
        $this->cache->put($this->key($submissionId), $value, self::KEEP_SECONDS);
    }

    /**
     * Names the host a write of the submission was ordered on, the only host that may pull its value.
     */
    public function bindTo(string $submissionId, string $hostId): void
    {
        $this->cache->put($this->hostKey($submissionId), $hostId, self::KEEP_SECONDS);
    }

    /**
     * The submission's value, once, for the host its write was ordered on; a second pull, a value that is gone or
     * another host is refused.
     *
     * @throws PrivateValueRefused
     */
    public function pull(string $submissionId, string $hostId): string
    {
        if ($this->cache->pull($this->hostKey($submissionId)) !== $hostId) {
            throw PrivateValueRefused::notOrderedFor($submissionId, $hostId);
        }

        $value = $this->cache->pull($this->key($submissionId));

        if (is_string($value)) {
            return $value;
        }

        throw PrivateValueRefused::gone($submissionId);
    }

    public function discard(string $submissionId): void
    {
        $this->cache->forget($this->key($submissionId));
    }

    private function key(string $submissionId): string
    {
        return "terminal-private-value:{$submissionId}";
    }

    private function hostKey(string $submissionId): string
    {
        return "terminal-private-value-host:{$submissionId}";
    }
}
