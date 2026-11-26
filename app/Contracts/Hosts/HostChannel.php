<?php

declare(strict_types=1);

namespace App\Contracts\Hosts;

use App\Values\HostOrderSource;
use App\Values\RowGuard;

/**
 * How the journal tells a host what to do with a process it runs: each call makes one order and answers its id; the
 * host claims the order through its long poll.
 */
interface HostChannel
{
    /**
     * Orders the terminal process to type the bytes while its rows still show what the guard saw, refused once its
     * input moved to a later generation; answers the order's id.
     */
    public function keys(
        string $processId,
        string $bytes,
        RowGuard $rows,
        int $inputGeneration,
        HostOrderSource $source,
    ): string;

    /**
     * Orders the pipe process to read the bytes on its standard input; answers the order's id.
     */
    public function write(string $processId, string $bytes, HostOrderSource $source): string;

    /**
     * Orders the terminal process's screen to the columns and rows; answers the order's id.
     */
    public function resize(string $processId, int $columns, int $rows, HostOrderSource $source): string;

    /**
     * Orders the signal sent to the process; answers the order's id.
     */
    public function signal(string $processId, string $signal, HostOrderSource $source): string;

    /**
     * Orders the process stopped, signalled to end after the grace and killed after the force milliseconds; answers
     * the order's id.
     */
    public function stop(string $processId, int $graceMs, int $forceMs, HostOrderSource $source): string;

    /**
     * Orders the terminal process's frames streamed at the rate, raw or drawn; answers the order's id.
     */
    public function stream(string $processId, int $framesPerSecond, bool $isRaw, HostOrderSource $source): string;

    /**
     * Orders one picture of the terminal process's screen; answers the order's id.
     */
    public function snapshot(string $processId, HostOrderSource $source): string;
}
