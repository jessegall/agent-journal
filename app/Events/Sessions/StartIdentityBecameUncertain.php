<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\StartIdentityEvent;

/**
 * A start's identity became uncertain.
 */
final readonly class StartIdentityBecameUncertain implements SessionEvent, StartIdentityEvent
{
    public function __construct(
        public string $startId,
    ) {}
}
