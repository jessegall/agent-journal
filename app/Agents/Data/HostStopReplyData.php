<?php

declare(strict_types=1);

namespace App\Agents\Data;

use Spatie\LaravelData\Data;

/**
 * The protected host's answer to a stop: the exit code, when the program reported one, and when it ended.
 */
final class HostStopReplyData extends Data
{
    public function __construct(
        public readonly int|null $exitCode,
        public readonly string $endedAt,
    ) {}
}
