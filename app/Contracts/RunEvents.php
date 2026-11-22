<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Enums\OutputStream;
use App\Values\PartEnd;
use App\Values\PartKey;

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
