<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Enums\ExitStatus;
use App\Enums\OutputStream;

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

    public function end(bool $drained): StepStatus
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

        $this->process->drain(fn (OutputStream $stream, string $bytes) => $state->events->output($part, $stream, $bytes));
        $end = $this->process->wait();
        $state->events->ended($part, $end, $drained);

        return StepStatus::ofEnd($end);
    }
}
