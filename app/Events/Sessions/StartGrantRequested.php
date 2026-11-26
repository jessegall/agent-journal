<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Asks\Contracts\AnsweredAtOnce;
use App\Sessions\StartAdditions;

/**
 * A host takes a session's start grant and is about to spawn its driver: listeners add the folders the start needs,
 * or refuse it when what it needs is not ready.
 */
final readonly class StartGrantRequested implements AnsweredAtOnce, SessionEvent
{
    public function __construct(
        public string $sessionId,
        public StartAdditions $additions,
    ) {}
}
