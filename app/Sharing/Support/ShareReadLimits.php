<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Sharing\Exceptions\ShareReadLimited;
use Illuminate\Cache\CacheManager;
use Illuminate\Cache\RateLimiter;
use Illuminate\Container\Attributes\Config;

/**
 * The public listener's limits, counted in the cache with a one-minute expiry: 120 reads a minute of one share, and
 * for links that lead nowhere 30 a minute from one trusted visitor address and 600 a minute in all. A valid link is
 * never held back by the count of invalid ones.
 */
final readonly class ShareReadLimits
{
    private const int READS_OF_A_SHARE = 120;

    private const int INVALID_FROM_ONE_SOURCE = 30;

    private const int INVALID_IN_ALL = 600;

    private const int WINDOW_SECONDS = 60;

    private RateLimiter $limiter;

    public function __construct(CacheManager $caches, #[Config('sharing.rate_limit_store')] string $store)
    {
        $this->limiter = new RateLimiter($caches->store($store));
    }

    /**
     * Counts one read of the share, refused once the share was read too often this minute.
     *
     * @throws ShareReadLimited
     */
    public function admitRead(string $shareId): void
    {
        if (! $this->admits("share-read:{$shareId}", self::READS_OF_A_SHARE)) {
            throw ShareReadLimited::forShare();
        }
    }

    /**
     * Counts one link that led nowhere, in all and from its source when a trusted rule names one.
     *
     * @throws ShareReadLimited
     */
    public function countInvalid(string|null $source): void
    {
        $admitted = $this->admits('share-invalid:all', self::INVALID_IN_ALL)

                    && ($source === null || $this->admits('share-invalid:'.hash('sha256', $source), self::INVALID_FROM_ONE_SOURCE));

        if (! $admitted) {
            throw ShareReadLimited::forInvalidLinks();
        }
    }

    /**
     * Counts one hit on the key when it is still under its most for this minute, and says whether it was.
     */
    private function admits(string $key, int $most): bool
    {
        if ($this->limiter->tooManyAttempts($key, $most)) {
            return false;
        }

        $this->limiter->hit($key, self::WINDOW_SECONDS);

        return true;
    }
}
