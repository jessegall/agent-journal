<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One limit window of a Claude Code status line: how much of it is used, in percent, and when it resets.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class StatusLineWindowData extends Data
{
    public function __construct(
        public readonly float $usedPercentage,
        public readonly int|null $resetsAt = null,
    ) {}

    /**
     * Whether the window holds a used percent from 0 to 100.
     */
    public function isMeasured(): bool
    {
        return $this->usedPercentage >= 0 && $this->usedPercentage <= 100;
    }
}
