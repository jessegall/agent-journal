<?php

declare(strict_types=1);

namespace App\Events\Connections;

/**
 * A host answered a workspace read with its sample.
 */
final readonly class WorkspaceReadAnswered implements ConnectionEvent
{
    public function __construct(
        public string $readId,
    ) {}
}
