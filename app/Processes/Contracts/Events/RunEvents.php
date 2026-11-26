<?php

declare(strict_types=1);

namespace App\Processes\Contracts\Events;

use App\Processes\Enums\OutputStream;
use App\Processes\Values\PartKey;
use App\Values\PartEnd;

/**
 * Where a supervisor reports what happens in its run: on the server they become
 * records at once; on the host they are spooled and sent over the signed event channel. A child's printed text is
 * only ever output, never one of these events.
 */
interface RunEvents
{
    /**
     * The part waits for its turn to start.
     */
    public function queued(PartKey $part): void;

    /**
     * The part's process started on the host under the process id.
     */
    public function started(PartKey $part, int $pid, string $host): void;

    /**
     * The part started inside a process that already runs on the host, so it has no process of its own.
     */
    public function startedInside(PartKey $part, string $host): void;

    /**
     * The part wrote these bytes on the stream.
     */
    public function output(PartKey $part, OutputStream $stream, string $bytes): void;

    /**
     * The part ended as the end says, with all its output read when drained.
     */
    public function ended(PartKey $part, PartEnd $end, bool $isDrained): void;

    /**
     * The part never started, because the result of an earlier part decided against it.
     */
    public function skipped(PartKey $part, string $controllingResult): void;

    /**
     * The part's process could not be started, for the reason given.
     */
    public function spawnFailed(PartKey $part, string $reason): void;

    /**
     * The part was stopped before it ended, for the reason given.
     */
    public function stopped(PartKey $part, string $reason): void;

    /**
     * The part's process was lost, so how it ended is unknown.
     */
    public function lost(PartKey $part): void;

    /**
     * The whole run was stopped, for the reason given.
     */
    public function runStopped(string $reason): void;

    /**
     * The run's root plan ended with this status: the attempt's one logical result, never one part's exit.
     */
    public function runFinished(int $rootStatus): void;

    /**
     * Why the part may not start any more because a rule, binding or policy it was admitted under changed, or an
     * empty text while its admission is still current.
     */
    public function staleReason(PartKey $part): string;
}
