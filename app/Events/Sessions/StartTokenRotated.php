<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\StartTokenEvent;

/**
 * A start token was replaced: the old one stopped working at once.
 */
final readonly class StartTokenRotated extends SessionEvent implements StartTokenEvent
{
    public function __construct(
        public string $tokenId,
    ) {}
}
