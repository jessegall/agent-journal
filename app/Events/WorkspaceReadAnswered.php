<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A host answered a workspace read with its sample.
 */
final readonly class WorkspaceReadAnswered extends ConnectionEvent
{
    public function __construct(
        public string $readId,
    ) {}
}
