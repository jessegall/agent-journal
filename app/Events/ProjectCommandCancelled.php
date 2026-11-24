<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Connections\ProjectCommandEvent;

/**
 * A project command run was cancelled.
 */
final readonly class ProjectCommandCancelled extends ConnectionEvent implements ProjectCommandEvent
{
    public function __construct(
        public string $runId,
    ) {}
}
