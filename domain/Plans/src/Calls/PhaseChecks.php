<?php

declare(strict_types=1);

namespace Domain\Plans\Calls;

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
        public int $phase,
        public string $title,
        public array $checks,
    ) {}
}
