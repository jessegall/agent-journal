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
    public function keys(
        string $processId,
        string $bytes,
        RowGuard $rows,
        int $inputGeneration,
        HostOrderSource $source,
    ): string;

    public function write(string $processId, string $bytes, HostOrderSource $source): string;

    public function resize(string $processId, int $columns, int $rows, HostOrderSource $source): string;

    public function signal(string $processId, string $signal, HostOrderSource $source): string;

    public function stop(string $processId, int $graceMs, int $forceMs, HostOrderSource $source): string;

    public function stream(string $processId, int $framesPerSecond, bool $isRaw, HostOrderSource $source): string;

    public function snapshot(string $processId, HostOrderSource $source): string;
}
