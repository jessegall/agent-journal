<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Agents\Support\LaunchAdditions;
use App\Contracts\Event;

/**
 * A host takes a session's launch grant and is about to spawn its program: listeners add the folders the launch needs,
 * or refuse it when what it needs is not ready.
 */
final readonly class LaunchGrantRequested implements Event
{
    public function __construct(
        public string $sessionId,
        public LaunchAdditions $additions,
    ) {}
}
