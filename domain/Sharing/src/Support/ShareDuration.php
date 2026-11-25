<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use Carbon\CarbonImmutable;
use Domain\Sharing\Exceptions\ShareDurationInvalid;

/**
 * How many minutes a share lasts: one minute to thirty days, seven days when the owner names none. A request fills in
 * the seven days before it builds the command, so the command always carries the minutes.
 */
final readonly class ShareDuration
{
    public const int STANDARD_MINUTES = 10_080;

    private const int FEWEST_MINUTES = 1;

    private const int MOST_MINUTES = 43_200;

    private function __construct(private int $minutes) {}

    /**
     * @throws ShareDurationInvalid
     */
    public static function of(int $minutes): self
    {
        if ($minutes < self::FEWEST_MINUTES || $minutes > self::MOST_MINUTES) {
            throw ShareDurationInvalid::of($minutes, self::FEWEST_MINUTES, self::MOST_MINUTES);
        }

        return new self($minutes);
    }

    public function deadlineFrom(CarbonImmutable $start): CarbonImmutable
    {
        return $start->addMinutes($this->minutes);
    }
}
