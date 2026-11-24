<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\StartTokenEvent;

/**
 * A start token was revoked.
 */
final readonly class StartTokenRevoked extends SessionEvent implements StartTokenEvent
{
    public function __construct(
        public string $tokenId,
    ) {}
}
