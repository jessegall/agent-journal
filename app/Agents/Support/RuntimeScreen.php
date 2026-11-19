<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Data\ScreenFrameData;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Cache\Repository;

/**
 * The latest frame of each runtime's screen, kept only in the cache and gone a minute after the last frame; a frame
 * is never written to the database or a log.
 */
final readonly class RuntimeScreen
{
    /**
     * How long a runtime's latest frame is kept after it arrived.
     */
    public const int KEEP_SECONDS = 60;

    public function __construct(private Repository $cache) {}

    /**
     * Keeps the frame as the runtime's latest unless the stored one is from the same host process and not older.
     */
    public function put(string $runtimeId, ScreenFrameData $frame, CarbonImmutable $receivedAt): void
    {
        $stored = $this->latest($runtimeId);
        if ($stored !== null && ! $frame->supersedes($stored->frame)) {
            return;
        }

        $this->cache->put($this->key($runtimeId), new ReceivedScreen($frame, $receivedAt), self::KEEP_SECONDS);
    }

    public function latest(string $runtimeId): ReceivedScreen|null
    {
        $stored = $this->cache->get($this->key($runtimeId));

        return $stored instanceof ReceivedScreen ? $stored : null;
    }

    private function key(string $runtimeId): string
    {
        return "runtime-screen:{$runtimeId}";
    }
}
