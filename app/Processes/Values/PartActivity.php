<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * What any running or ended part shows without a reader: its name, its lifecycle as a
 * user reads it, the seconds it has run, the bytes of each stream, when it last wrote, and its latest line. It never
 * states a pass, a failure, a count or a percent.
 */
final readonly class PartActivity
{
    /**
     * @param  array<string, int>  $bytes  stream => bytes captured
     */
    public function __construct(
        public string $partRunId,
        public string $name,
        public string $lifecycle,
        public int $elapsedSeconds,
        public array $bytes,
        public string $lastActivityAt,
        public string|null $latestLine,
    ) {}
}
