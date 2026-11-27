<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Bus\Contracts\Pipe;
use App\Processes\Enums\OutputStream;
use App\Processes\Execution\SpawnedPart;
use App\Support\Execution\PipedCommands;
use App\Support\Execution\PipelinePump;
use App\Support\Execution\PumpedCommands;
use App\Support\Execution\StepOutcome;

/**
 * Pumps each command's output into the next while they run, recording every byte, and keeps the last command's
 * standard output up to the limit a step keeps.
 */
final readonly class PumpPipedCommands implements Pipe
{
    public function handle(PipedCommands $commands): PumpedCommands
    {
        $started = $commands->started;
        $stdout = '';

        $pump = function (int $index, OutputStream $stream, string $bytes) use ($started, &$stdout): void {
            $started[$index]->recordOutput($stream, $bytes);

            $kept = $index === array_key_last($started)
                && $stream === OutputStream::Stdout
                && strlen($stdout) < StepOutcome::KEPT_OUTPUT_BYTE_LIMIT;

            $stdout .= $kept ? $bytes : '';
        };

        $processes = array_map(fn (SpawnedPart $part) => $part->process, $started);
        new PipelinePump()->run($processes, $pump, $commands->stopSignal());

        return new PumpedCommands($commands, $stdout);
    }
}
