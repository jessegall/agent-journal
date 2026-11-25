<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Enums\Accounts\CommandEntry;
use App\Support\CommandEntrance;
use App\Support\EngineAccess;
use App\Support\EnginePass;
use App\Support\StackTransaction;
use App\Values\StackTarget;
use Closure;

/**
 * Runs test work as an engine handler would: in an engine pass, with a frame grant for one target, in a transaction.
 */
trait RunsAsEngine
{
    /**
     * Runs the work as a tick's own work: in an engine pass, with the frame granted and the application's entrance
     * opened for its commands.
     *
     * @param  Closure(): void  $work
     */
    private function asEngineFor(StackTarget $target, Closure $work): void
    {
        $this->app->make(EnginePass::class)->run(function () use ($target, $work): void {
            $this->app->make(EngineAccess::class)->grantFrame($target, 'frame-of-the-tick');
            $tickWork = fn (): mixed => $this->app->make(StackTransaction::class)->run($work);
            $this->app->make(CommandEntrance::class)->through(CommandEntry::Application, $tickWork);
        });
    }
}
