<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\StartIdentityEvent;

/**
 * A start was bound to its driver session's native id.
 */
final readonly class StartIdentityBound extends SessionEvent implements StartIdentityEvent
{
    public function __construct(
        public string $startId,
        public string $nativeId,
    ) {}
}
