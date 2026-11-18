<?php

declare(strict_types=1);

namespace App\Engine\Values;

use App\Engine\Exceptions\MonotonicClockWentBack;

/**
 * How much time passed, held in whole nanoseconds; approximate when it was not measured on one monotonic clock.
 */
final readonly class ElapsedTime
{
    private const int NANOSECONDS_PER_SECOND = 1_000_000_000;

    private const int NANOSECONDS_PER_MILLISECOND = 1_000_000;

    private function __construct(
        private int $nanoseconds,
        private bool $approximate,
    ) {}

    /**
     * The exact time between two readings of one monotonic clock.
     *
     * @throws MonotonicClockWentBack
     */
    public static function between(int $startNanoseconds, int $endNanoseconds): self
    {
        if ($endNanoseconds < $startNanoseconds) {
            throw MonotonicClockWentBack::between($startNanoseconds, $endNanoseconds);
        }

        return new self($endNanoseconds - $startNanoseconds, false);
    }

    public static function fromSeconds(float $seconds, bool $approximate): self
    {
        return new self((int) round($seconds * self::NANOSECONDS_PER_SECOND), $approximate);
    }

    public static function zero(bool $approximate): self
    {
        return new self(0, $approximate);
    }

    public function seconds(): float
    {
        return $this->nanoseconds / self::NANOSECONDS_PER_SECOND;
    }

    public function milliseconds(): int
    {
        return intdiv($this->nanoseconds, self::NANOSECONDS_PER_MILLISECOND);
    }

    public function isApproximate(): bool
    {
        return $this->approximate;
    }

    /**
     * Both spans together; approximate when either is.
     */
    public function plus(self $other): self
    {
        return new self($this->nanoseconds + $other->nanoseconds, $this->approximate || $other->approximate);
    }
}
