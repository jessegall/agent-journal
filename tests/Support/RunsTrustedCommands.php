<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\Bus\Command;
use App\Support\ActorStore;
use App\Support\CommandRegistry;
use App\Support\JournalCommands;

/**
 * Runs a trusted entry's command as the journal does: as the system, through the command's own entry.
 */
trait RunsTrustedCommands
{
    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function throughEntry(Command $command): mixed
    {
        $entry = $this->app->make(CommandRegistry::class)->entryOf($command::class);
        $dispatcher = $this->app->make(JournalCommands::class)->for($entry);

        return $this->app->make(ActorStore::class)->actAsSystem('test', fn (): mixed => $dispatcher->run($command));
    }

    /**
     * Runs the command as the system on a fresh request: the scoped instances of the last one are forgotten first.
     *
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function asSystem(Command $command): mixed
    {
        $this->app->forgetScopedInstances();

        return $this->throughEntry($command);
    }
}
