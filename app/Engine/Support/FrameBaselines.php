<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Engine\Exceptions\FrameBaselineMissing;
use App\Hooks\Ticks\ElapsedTime;
use App\Registries\Support\Registry;
use PhpOption\Option;

/**
 * The monotonic reading at which each frame's last tick settled, kept in this process only: a reading is never
 * compared with one from another process, so a restart starts with none.
 */
final class FrameBaselines
{
    /**
     * @var Registry<int>
     */
    private readonly Registry $settledAt;

    public function __construct()
    {
        $this->settledAt = Registry::replacing(FrameBaselineMissing::forFrame(...));
    }

    public function has(string $frameId): bool
    {
        return $this->settledAt->has($frameId);
    }

    /**
     * The time from the frame's last settled tick to the given reading; none before its first tick in this process.
     *
     * @return Option<ElapsedTime>
     */
    public function elapsedUntil(string $frameId, int $monotonicNanoseconds): Option
    {
        return $this->settledAt->find($frameId)
            ->map(fn (int $settledAt) => ElapsedTime::between($settledAt, $monotonicNanoseconds));
    }

    public function settle(string $frameId, int $monotonicNanoseconds): void
    {
        $this->settledAt->put($frameId, $monotonicNanoseconds);
    }
}
