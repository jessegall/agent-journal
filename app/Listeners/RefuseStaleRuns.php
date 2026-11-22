<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Commands\MarkRunsStale\MarkRunsStaleCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Events\Listener;
use App\Events\BundleActivated;
use App\Events\RuleActivated;
use App\Events\RuleRetired;

/**
 * After a project's active rules changed, its unfinished runs no longer rest on the rules they were admitted under.
 */
final readonly class RefuseStaleRuns implements Listener
{
    public function __construct(private CommandBus $commands) {}

    public function handle(RuleActivated|RuleRetired|BundleActivated $change): void
    {
        $this->commands->run(new MarkRunsStaleCommand($change->project(), $change->staleReason()));
    }
}
