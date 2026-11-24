<?php

declare(strict_types=1);

namespace App\Events;

/**
 * The driver builds an approval allows were set.
 */
final readonly class DriverBuildsApproved extends SessionEvent
{
    public function __construct(
        public string $approvalId,
    ) {}
}
