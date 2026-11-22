<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Agents\Support\StartAdditions;
use App\Contracts\AnsweredAtOnce;

/**
 * A host takes a session's start grant and is about to spawn its driver: listeners add the folders the start needs,
 * or refuse it when what it needs is not ready.
 */
final readonly class StartGrantRequested implements AnsweredAtOnce
{
    public function __construct(
        public string $sessionId,
        public StartAdditions $additions,
    ) {}
}
