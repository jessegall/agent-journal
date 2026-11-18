<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Enums\OutputStream;
use App\Processes\Values\PartEnd;
use App\Processes\Values\PartKey;

/**
 * Where a supervisor reports what happens in its run (doc 21 revision 6, section 53): on the server they become
 * records at once; on the host they are spooled and sent over the signed event channel. A child's printed text is
 * only ever output, never one of these events.
 */
interface RunEvents
{
    public function queued(PartKey $part): void;

    public function started(PartKey $part, int $pid, string $host): void;

    public function startedInside(PartKey $part, string $host): void;

    public function output(PartKey $part, OutputStream $stream, string $bytes): void;

    public function ended(PartKey $part, PartEnd $end, bool $drained): void;

    public function skipped(PartKey $part, string $controllingResult): void;

    public function spawnFailed(PartKey $part, string $reason): void;

    public function stopped(PartKey $part, string $reason): void;

    public function lost(PartKey $part): void;

    public function runStopped(string $reason): void;
}
