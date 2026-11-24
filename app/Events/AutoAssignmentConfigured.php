<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A record's automatic assignment was switched on or off, with its pool and size.
 */
final readonly class AutoAssignmentConfigured extends AssignmentEvent
{
    public function __construct(
        public string $autoAssignmentId,
        public bool $isEnabled,
        public int $size,
    ) {}
}
