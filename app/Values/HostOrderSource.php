<?php

declare(strict_types=1);

namespace App\Values;

use Illuminate\Support\Str;

/**
 * Who an order comes from: a worker carrying out one step of a driver request, fenced by its generation, or the
 * journal itself. A step's order keeps one idempotency key over its retries, so a repeated step makes no second order.
 */
final readonly class HostOrderSource
{
    private function __construct(
        public string|null $driverRequestId,
        public string|null $step,
        public int $attempt,
        public int|null $workerGeneration,
    ) {}

    public static function forStep(string $driverRequestId, string $step, int $attempt, int $workerGeneration): self
    {
        return new self($driverRequestId, $step, $attempt, $workerGeneration);
    }

    /**
     * A worker's own order, about no driver request, such as the snapshot it starts with.
     */
    public static function forWorker(int $generation): self
    {
        return new self(null, null, 0, $generation);
    }

    public static function fromJournal(): self
    {
        return new self(null, null, 0, null);
    }

    public function idempotencyKey(): string
    {
        if ($this->driverRequestId === null) {
            return (string) Str::ulid();
        }

        return "{$this->driverRequestId}:{$this->step}:{$this->attempt}";
    }
}
