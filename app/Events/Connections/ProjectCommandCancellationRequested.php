<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Connections\Contracts\ProjectCommandEvent;

/**
 * A project command run was asked to cancel.
 */
final readonly class ProjectCommandCancellationRequested implements ConnectionEvent, ProjectCommandEvent
{
    public function __construct(
        public string $runId,
    ) {}
}
