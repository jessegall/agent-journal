<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Connections\ProjectCommandEvent;

/**
 * A project command run was cancelled.
 */
final readonly class ProjectCommandCancelled implements ConnectionEvent, ProjectCommandEvent
{
    public function __construct(
        public string $runId,
    ) {}
}
