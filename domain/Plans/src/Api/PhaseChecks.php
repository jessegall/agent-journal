<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

use Spatie\LaravelData\Data;

/**
 * A phase and the checks recorded on it.
 */
final class PhaseChecks extends Data
{
    /**
     * @param  list<array{operation: string, outcome: string, receipt: string, recorded_by: string}>  $checks
     */
    public function __construct(
        public readonly int $phase,
        public readonly string $title,
        public readonly array $checks,
    ) {}
}
