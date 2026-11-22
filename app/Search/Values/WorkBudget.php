<?php

declare(strict_types=1);

namespace App\Search\Values;

/**
 * The work one provider call may still do: candidates it may examine, bytes of source text it may read and the
 * moment it must stop. A provider charges its work against it before each read.
 */
final readonly class WorkBudget
{
    public const int CANDIDATE_LIMIT = 32;

    public const int BYTE_LIMIT = 65_536;

    public function __construct(
        public int $candidates,
        public int $bytes,
        public int $deadlineNanoseconds,
    ) {}

    /**
     * The standard allowance of one batch, ending after the given milliseconds from now.
     */
    public static function forBatch(int $milliseconds): self
    {
        return new self(self::CANDIDATE_LIMIT, self::BYTE_LIMIT, hrtime(true) + $milliseconds * 1_000_000);
    }

    public function hasTimeLeft(): bool
    {
        return hrtime(true) < $this->deadlineNanoseconds;
    }

    public function remainingMilliseconds(): int
    {
        return max(0, intdiv($this->deadlineNanoseconds - hrtime(true), 1_000_000));
    }
}
