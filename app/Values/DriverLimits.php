<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The waits and retries the journal decides for a runtime's driver, in milliseconds, sent with its start: how long a
 * delivery waits for a ready composer and for its line to show, how often an unsent line gets Enter again, how long a
 * turn has to take the composer, how long a stranded line may settle, and how long a stopped program has to end.
 */
final readonly class DriverLimits
{
    public function __construct(
        public int $readyWaitMs = 10_000,
        public int $echoWaitMs = 5_000,
        public int $unsentLookMs = 2_000,
        public int $unsentEnters = 3,
        public int $turnStartWindowMs = 10_000,
        public int $strandedSettleMs = 5_000,
        public int $stopGraceMs = 5_000,
        public int $stopForceMs = 2_000,
    ) {}

    /**
     * @return array{ready_wait_ms: int, echo_wait_ms: int, unsent_look_ms: int, unsent_enters: int,
     *     turn_start_window_ms: int, stranded_settle_ms: int, stop_grace_ms: int, stop_force_ms: int}
     */
    public function toArray(): array
    {
        return [
            'ready_wait_ms' => $this->readyWaitMs,
            'echo_wait_ms' => $this->echoWaitMs,
            'unsent_look_ms' => $this->unsentLookMs,
            'unsent_enters' => $this->unsentEnters,
            'turn_start_window_ms' => $this->turnStartWindowMs,
            'stranded_settle_ms' => $this->strandedSettleMs,
            'stop_grace_ms' => $this->stopGraceMs,
            'stop_force_ms' => $this->stopForceMs,
        ];
    }
}
