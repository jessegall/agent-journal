<?php

declare(strict_types=1);

namespace App\Values;

use Illuminate\Support\Str;

/**
 * Who an instruction comes from: a worker carrying out one step of a driver request, fenced by its generation, or the
 * journal itself. A step's instruction keeps one idempotency key over its retries, so a repeated step makes no second instruction.
 */
final readonly class HostInstructionSource
{
    private function __construct(
        public string|null $driverRequestId,
        public string|null $step,
        public int $attempt,
        public int|null $workerGeneration,
        public string|null $key = null,
    ) {}

    public static function forStep(string $driverRequestId, string $step, int $attempt, int $workerGeneration): self
    {
        return new self($driverRequestId, $step, $attempt, $workerGeneration);
    }

    /**
     * A worker's own instruction, about no driver request, such as the snapshot it starts with.
     */
    public static function forWorker(int $generation): self
    {
        return new self(null, null, 0, $generation);
    }

    public static function fromJournal(): self
    {
        return new self(null, null, 0, null);
    }

    /**
     * A journal instruction made once for the key given: the same key asked again finds the instruction already made.
     */
    public static function keyed(string $key): self
    {
        return new self(null, null, 0, null, $key);
    }

    public function idempotencyKey(): string
    {
        if ($this->key !== null) {
            return $this->key;
        }

        if ($this->driverRequestId === null) {
            return (string) Str::ulid();
        }

        return "{$this->driverRequestId}:{$this->step}:{$this->attempt}";
    }
}
