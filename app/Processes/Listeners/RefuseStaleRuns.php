<?php

declare(strict_types=1);

namespace App\Processes\Listeners;

use App\Bus\Contracts\CommandBus;
use App\Contracts\Listener;
use App\Processes\Commands\MarkRunsStale;
use App\Processes\Contracts\ChangesActiveRules;

/**
 * After a project's active rules changed, its unfinished runs no longer rest on the rules they were admitted under.
 */
final readonly class RefuseStaleRuns implements Listener
{
    public function __construct(private CommandBus $commands) {}

    public function handle(ChangesActiveRules $change): void
    {
        $this->commands->run(new MarkRunsStale($change->project(), $change->staleReason()));
    }
}
