<?php

declare(strict_types=1);

namespace App\Hosts\Contracts;

use App\Values\HostInstructionSource;
use App\Values\RowGuard;

/**
 * How the journal tells a host what to do with a process it runs: each call makes one instruction and answers its id;
 * the host claims the instruction through its long poll.
 */
interface HostChannel
{
    /**
     * Instructs the terminal process to type the bytes while its rows still show what the guard saw, refused once its
     * input moved to a later generation; answers the instruction's id.
     */
    public function keys(
        string $processId,
        string $bytes,
        RowGuard $rows,
        int $inputGeneration,
        HostInstructionSource $source,
    ): string;

    /**
     * Instructs the host to type a user's keys into the terminal process at once, unguarded, raising its input
     * generation; answers the instruction's id.
     */
    public function userKeys(string $processId, string $bytes, HostInstructionSource $source): string;

    /**
     * Instructs the pipe process to read the bytes on its standard input; answers the instruction's id.
     */
    public function write(string $processId, string $bytes, HostInstructionSource $source): string;

    /**
     * Instructs the terminal process's screen to the columns and rows; answers the instruction's id.
     */
    public function resize(string $processId, int $columns, int $rows, HostInstructionSource $source): string;

    /**
     * Instructs the signal sent to the process; answers the instruction's id.
     */
    public function signal(string $processId, string $signal, HostInstructionSource $source): string;

    /**
     * Instructs the process stopped, signalled to end after the grace and killed after the force milliseconds; answers
     * the instruction's id.
     */
    public function stop(string $processId, int $graceMs, int $forceMs, HostInstructionSource $source): string;

    /**
     * Instructs the terminal process's frames streamed at the rate, raw or drawn; answers the instruction's id.
     */
    public function stream(string $processId, int $framesPerSecond, bool $isRaw, HostInstructionSource $source): string;

    /**
     * Asks the host for one picture of the terminal process's screen; answers the instruction's id.
     */
    public function snapshot(string $processId, HostInstructionSource $source): string;

    /**
     * Instructs the host to hold back every frame and recording of the terminal process, so a private value can go in;
     * answers the instruction's id.
     */
    public function openPrivate(string $processId, HostInstructionSource $source): string;

    /**
     * Instructs the private submission's value written into the process, the instruction naming only the submission;
     * answers the instruction's id.
     */
    public function writePrivate(string $processId, string $submissionId, HostInstructionSource $source): string;

    /**
     * Instructs the process's frames to leave again once its screen redrew; answers the instruction's id.
     */
    public function closePrivate(string $processId, HostInstructionSource $source): string;
}
