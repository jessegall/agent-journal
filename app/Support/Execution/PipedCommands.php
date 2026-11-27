<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Processes\Contracts\SpawnablePart;
use App\Processes\Execution\QueuedPart;
use App\Processes\Execution\SpawnedPart;
use App\Processes\Execution\StopSignal;

/**
 * The commands of a shell pipeline, started one after another with each reading the one before it: those still to
 * start, those started, and whether one could not start, which ends the pipeline as not found.
 */
final readonly class PipedCommands implements SpawnablePart
{
    /**
     * @param  list<QueuedPart>  $waiting
     * @param  list<SpawnedPart>  $started
     */
    public function __construct(
        public PendingStep $toRun,
        public array $waiting,
        public array $started = [],
        public bool $isRefused = false,
    ) {}

    public function hasWaiting(): bool
    {
        return $this->waiting !== [] && ! $this->isRefused;
    }

    public function nextSpawnable(): QueuedPart
    {
        return $this->waiting[0];
    }

    public function spawned(SpawnedPart $part): self
    {
        return new self($this->toRun, array_slice($this->waiting, 1), [...$this->started, $part]);
    }

    public function refused(string $reason): self
    {
        return new self($this->toRun, array_slice($this->waiting, 1), $this->started, true);
    }

    /**
     * The signal that asks the run, and so these commands, to stop.
     */
    public function stopSignal(): StopSignal
    {
        return $this->toRun->state->stop;
    }
}
