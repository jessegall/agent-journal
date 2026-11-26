<?php

declare(strict_types=1);

namespace App\Records\Values;

use DateTimeImmutable;

/**
 * When a record started, and when it finished once it has; a record still running has no finish.
 */
final readonly class SummaryPeriod
{
    public function __construct(
        public DateTimeImmutable $startedAt,
        public DateTimeImmutable|null $finishedAt = null,
    ) {}
}
