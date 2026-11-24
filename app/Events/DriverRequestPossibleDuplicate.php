<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Drivers\DriverRequestEvent;

/**
 * A driver request may duplicate an earlier one.
 */
final readonly class DriverRequestPossibleDuplicate extends SessionEvent implements DriverRequestEvent
{
    public function __construct(
        public string $requestId,
        public string $originalId,
    ) {}
}
