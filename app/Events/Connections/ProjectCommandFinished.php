<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Connections\Contracts\ProjectCommandEvent;

/**
 * A project command run finished with its exit code.
 */
final readonly class ProjectCommandFinished implements ConnectionEvent, ProjectCommandEvent
{
    public function __construct(
        public string $runId,
        public int $exitCode,
    ) {}
}
