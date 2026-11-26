<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use Illuminate\Cache\CacheManager;
use Illuminate\Container\Attributes\Config;
use Illuminate\Contracts\Cache\Repository;

/**
 * Single-use probe challenges: the health check issues a random one, the share listener answers it once through the
 * public origin, and it expires after a minute either way.
 */
final readonly class ProbeChallenges
{
    private const int SECONDS = 60;

    private Repository $cache;

    public function __construct(CacheManager $caches, #[Config('sharing.rate_limit_store')] string $store)
    {
        $this->cache = $caches->store($store);
    }

    public function issue(): string
    {
        $challenge = bin2hex(random_bytes(16));
        $this->cache->put($this->key($challenge), true, self::SECONDS);

        return $challenge;
    }

    /**
     * Whether the challenge was issued and not answered yet; answering it uses it up.
     */
    public function answer(string $challenge): bool
    {
        return $this->cache->pull($this->key($challenge)) === true;
    }

    private function key(string $challenge): string
    {
        return "share-probe:{$challenge}";
    }
}
