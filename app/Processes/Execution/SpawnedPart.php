<?php

declare(strict_types=1);

namespace App\Processes\Execution;

use App\Processes\Enums\ExitStatus;
use App\Processes\Enums\OutputStream;
use App\Values\ExecutionContext;

/**
 * A part whose process started; ending it stops it when the run was stopped, otherwise waits for it and records its
 * end, and answers the status the next branch decides on, a signal kept as a signal in the stored end.
 */
final readonly class SpawnedPart
{
    /**
     * How long a stopped part may take to end after the polite signal before it is forced.
     */
    private const float STOP_GRACE_SECONDS = 5.0;

    public function __construct(public QueuedPart $queued, public SpawnedProcess $process) {}

    /**
     * Keeps the part running in the background, to wait for at the run's end.
     */
    public function runInBackground(): void
    {
        $this->queued->state->track($this);
    }

    public function context(): ExecutionContext
    {
        return $this->queued->context;
    }

    /**
     * Records bytes the part's process printed on one of its streams.
     */
    public function recordOutput(OutputStream $stream, string $bytes): void
    {
        $this->queued->state->events->output($this->queued->part, $stream, $bytes);
    }

    public function end(bool $isDrained): StepStatus
    {
        $state = $this->queued->state;
        $part = $this->queued->part;

        if ($state->stop->isRequested() && ! $this->process->hasEnded()) {
            if ($this->process->stopGroup(self::STOP_GRACE_SECONDS)) {
                $state->events->stopped($part, $state->stop->reason());
            } else {
                $state->events->lost($part);
            }

            return ExitStatus::Interrupted->status();
        }

        $this->process->drain(
            fn (OutputStream $stream, string $bytes) => $state->events->output($part, $stream, $bytes),
        );

        $end = $this->process->wait();
        $state->events->ended($part, $end, $isDrained);

        return StepStatus::ofEnd($end);
    }
}
