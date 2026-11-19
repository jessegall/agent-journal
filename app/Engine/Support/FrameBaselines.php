<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Engine\Exceptions\FrameBaselineMissing;
use App\Registries\Support\Registry;

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
     * @throws FrameBaselineMissing
     */
    public function of(string $frameId): int
    {
        return $this->settledAt->get($frameId);
    }

    public function settle(string $frameId, int $monotonicNanoseconds): void
    {
        $this->settledAt->put($frameId, $monotonicNanoseconds);
    }
}
