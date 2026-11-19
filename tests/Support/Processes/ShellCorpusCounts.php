<?php

declare(strict_types=1);

namespace Tests\Support\Processes;

use Spatie\LaravelData\Data;

/**
 * How many cases the shell corpus holds and how many inputs they came from.
 */
final class ShellCorpusCounts extends Data
{
    public function __construct(public readonly int $cases, public readonly int $inputs) {}
}
