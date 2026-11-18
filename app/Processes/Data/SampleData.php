<?php

declare(strict_types=1);

namespace App\Processes\Data;

use Spatie\LaravelData\Data;

/**
 * One owner-approved sample of the request: the exact line and effects approved, its capture limits, and, once run,
 * the run with each part's own end and capture state. Samples are evidence only.
 */
final class SampleData extends Data
{
    /**
     * @param  list<string>  $approvedClasses
     * @param  list<string>  $parts  each part's operation, end and capture state as one readable line
     */
    public function __construct(
        public readonly string $permitId,
        public readonly string $line,
        public readonly array $approvedClasses,
        public readonly int $byteCap,
        public readonly int $secondsCap,
        public readonly string $runId,
        public readonly array $parts,
    ) {}
}
