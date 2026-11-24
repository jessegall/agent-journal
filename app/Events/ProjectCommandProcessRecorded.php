<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Connections\ProjectCommandEvent;

/**
 * A project command run's process started under its process id.
 */
final readonly class ProjectCommandProcessRecorded extends ConnectionEvent implements ProjectCommandEvent
{
    public function __construct(
        public string $runId,
        public int $pid,
    ) {}
}
