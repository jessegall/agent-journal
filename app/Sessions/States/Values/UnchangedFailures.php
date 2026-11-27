<?php

declare(strict_types=1);

namespace App\Sessions\States\Values;

use Spatie\LaravelData\Data;

/**
 * The run of failed stops in a row with the same failure: how many, the failure and the attempt counted last, so a
 * retried stop counts its attempt once.
 */
final class UnchangedFailures extends Data
{
    public function __construct(
        public readonly int $count,
        public readonly string|null $failure,
        public readonly string|null $attemptId,
    ) {}

    public static function none(): self
    {
        return new self(0, null, null);
    }

    /**
     * The run after this failed attempt: one longer when it failed the same way, else a new run of one.
     */
    public function after(string $attemptId, string $failure): self
    {
        if ($attemptId === $this->attemptId) {
            return $this;
        }

        return new self($failure === $this->failure ? $this->count + 1 : 1, $failure, $attemptId);
    }
}
