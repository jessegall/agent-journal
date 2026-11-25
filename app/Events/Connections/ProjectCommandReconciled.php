<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Connections\ProjectCommandEvent;
use App\Enums\Connections\CommandRunState;

/**
 * A project command run's state was settled from what its host reported.
 */
final readonly class ProjectCommandReconciled extends ConnectionEvent implements ProjectCommandEvent
{
    public function __construct(
        public string $runId,
        public CommandRunState $state,
    ) {}
}
