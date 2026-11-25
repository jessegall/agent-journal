<?php

declare(strict_types=1);

namespace App\Events\Messages;

/**
 * A user's presence was confirmed at a moment.
 */
final readonly class UserPresenceConfirmed implements MessageEvent
{
    public function __construct(
        public string $presenceId,
    ) {}
}
