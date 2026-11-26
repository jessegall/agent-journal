<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\SessionTokenEvent;

/**
 * A start token was revoked.
 */
final readonly class SessionTokenRevoked implements SessionEvent, SessionTokenEvent
{
    public function __construct(
        public string $tokenId,
    ) {}
}
