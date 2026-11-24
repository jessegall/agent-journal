<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\StartTokenEvent;

/**
 * A session was given its start token.
 */
final readonly class StartTokenIssued extends SessionEvent implements StartTokenEvent
{
    public function __construct(
        public string $tokenId,
        public string $sessionId,
    ) {}
}
