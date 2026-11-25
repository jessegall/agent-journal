<?php

declare(strict_types=1);

namespace App\Events\Sessions;

/**
 * The driver builds an approval allows were set.
 */
final readonly class DriverBuildsApproved implements SessionEvent
{
    public function __construct(
        public string $approvalId,
    ) {}
}
