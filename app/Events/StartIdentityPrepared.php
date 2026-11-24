<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\StartIdentityEvent;

/**
 * A start prepared the identity its driver session will carry.
 */
final readonly class StartIdentityPrepared extends SessionEvent implements StartIdentityEvent
{
    public function __construct(
        public string $startId,
    ) {}
}
