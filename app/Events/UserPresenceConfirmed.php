<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A user's presence was confirmed at a moment.
 */
final readonly class UserPresenceConfirmed extends MessageEvent
{
    public function __construct(
        public string $presenceId,
    ) {}
}
