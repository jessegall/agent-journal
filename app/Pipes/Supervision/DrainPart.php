<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Enums\OutputStream;
use App\Support\Execution\DrainedPart;
use App\Support\Execution\SpawnedPart;
use App\Support\Execution\SpawnedProcess;
use App\Support\Execution\StepOutcome;

/**
 * Reads a started part's output while it runs: every byte is recorded, and its standard output is kept for a
 * substitution up to the limit a step keeps.
 */
final readonly class DrainPart implements Pipe
{
    public function handle(SpawnedPart $spawned): DrainedPart
    {
        $queued = $spawned->queued;
        $events = $queued->state->events;
        $stdout = '';

        $keep = function (OutputStream $stream, string $bytes) use ($queued, $events, &$stdout): void {
            $events->output($queued->part, $stream, $bytes);
            $isKept = $stream === OutputStream::Stdout && strlen($stdout) < StepOutcome::KEPT_OUTPUT_BYTE_LIMIT;
            $stdout .= $isKept ? $bytes : '';
        };
        $drained = $spawned->process->drain($keep, SpawnedProcess::DRAIN_SECONDS, $queued->state->stop);

        return new DrainedPart($spawned, $stdout, $drained);
    }
}
