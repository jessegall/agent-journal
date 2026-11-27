<?php

declare(strict_types=1);

namespace App\Sessions\States\Values;

use Spatie\LaravelData\Data;

/**
 * The run of failed stops in a row with the same failure: how many, the failure and the attempt counted last, so a
 * retried stop counts its attempt once. Its state alone holds it and changes it.
 */
final class UnchangedFailures extends Data
{
    public function __construct(
        public int $count = 0,
        public string|null $failure = null,
        public string|null $attemptId = null,
    ) {}

    /**
     * Counts this failed attempt: one more when it failed the same way, else a new run of one.
     */
    public function failAttempt(string $attemptId, string $failure): void
    {
        if ($attemptId === $this->attemptId) {
            return;
        }

        $this->count = $failure === $this->failure ? $this->count + 1 : 1;
        $this->failure = $failure;
        $this->attemptId = $attemptId;
    }

    public function passStop(): void
    {
        $this->count = 0;
        $this->failure = null;
        $this->attemptId = null;
    }
}
