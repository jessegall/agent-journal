<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Engine\Exceptions\FrameBaselineMissing;

/**
 * The monotonic reading at which each frame's last tick settled, kept in this process only: a reading is never
 * compared with one from another process, so a restart starts with none.
 */
final class FrameBaselines
{
    /**
     * @var array<string, int>
     */
    private array $settledAt = [];

    public function has(string $frameId): bool
    {
        return array_key_exists($frameId, $this->settledAt);
    }

    /**
     * @throws FrameBaselineMissing
     */
    public function of(string $frameId): int
    {
        return $this->settledAt[$frameId] ?? throw FrameBaselineMissing::forFrame($frameId);
    }

    public function settle(string $frameId, int $monotonicNanoseconds): void
    {
        $this->settledAt[$frameId] = $monotonicNanoseconds;
    }
}
