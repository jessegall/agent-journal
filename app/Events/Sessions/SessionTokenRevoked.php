<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\SessionTokenEvent;

/**
 * A start token was revoked.
 */
final readonly class SessionTokenRevoked extends SessionEvent implements SessionTokenEvent
{
    public function __construct(
        public string $tokenId,
    ) {}
}
