<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\SessionTokenEvent;

/**
 * A start token was replaced: the old one stopped working at once.
 */
final readonly class SessionTokenRotated implements SessionEvent, SessionTokenEvent
{
    public function __construct(
        public string $tokenId,
    ) {}
}
