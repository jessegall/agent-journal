<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Support\ActorStore;
use App\Bus\Contracts\Command;
use App\Bus\Support\CommandRegistry;
use App\Bus\Support\EntryDispatchers;

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
        $dispatcher = $this->app->make(EntryDispatchers::class)->for($entry);

        return $this->app->make(ActorStore::class)->actAsSystem('test', fn (): mixed => $dispatcher->run($command));
    }
}
