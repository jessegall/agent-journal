<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\StartIdentityEvent;

/**
 * A start's identity became uncertain.
 */
final readonly class StartIdentityBecameUncertain extends SessionEvent implements StartIdentityEvent
{
    public function __construct(
        public string $startId,
    ) {}
}
