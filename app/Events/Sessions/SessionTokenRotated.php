<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\SessionTokenEvent;

/**
 * A start token was replaced: the old one stopped working at once.
 */
final readonly class SessionTokenRotated extends SessionEvent implements SessionTokenEvent
{
    public function __construct(
        public string $tokenId,
    ) {}
}
