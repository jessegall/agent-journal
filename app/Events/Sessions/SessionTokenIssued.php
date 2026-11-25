<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\SessionTokenEvent;

/**
 * A session was given its start token.
 */
final readonly class SessionTokenIssued extends SessionEvent implements SessionTokenEvent
{
    public function __construct(
        public string $tokenId,
        public string $sessionId,
    ) {}
}
