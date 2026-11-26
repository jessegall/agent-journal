<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\SessionTokenEvent;

/**
 * A session was given its start token.
 */
final readonly class SessionTokenIssued implements SessionEvent, SessionTokenEvent
{
    public function __construct(
        public string $tokenId,
        public string $sessionId,
    ) {}
}
