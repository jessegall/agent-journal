<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Bus\Contracts\CommandBus;
use App\Contracts\Events\Listener;
use App\Processes\Commands\MarkRunsStale\MarkRunsStaleCommand;
use App\Processes\Contracts\Events\ActiveRuleChange;

/**
 * After a project's active rules changed, its unfinished runs no longer rest on the rules they were admitted under.
 */
final readonly class RefuseStaleRuns implements Listener
{
    public function __construct(private CommandBus $commands) {}

    public function handle(ActiveRuleChange $change): void
    {
        $this->commands->run(new MarkRunsStaleCommand($change->projectId, $change->staleReason()));
    }
}
