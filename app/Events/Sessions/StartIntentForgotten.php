<?php

declare(strict_types=1);

namespace App\Events\Sessions;

/**
 * A start that started nothing was forgotten, leaving its key free.
 */
final readonly class StartIntentForgotten extends SessionEvent
{
    public function __construct(
        public string $startId,
    ) {}
}
