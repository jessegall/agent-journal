<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Actors\Support\ActorStore;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\CommandEntry;

/**
 * Gives each trusted entry its own dispatcher; Core's transports and jobs ask it for theirs by name, and no payload
 * or header can choose one.
 */
final readonly class EntryDispatchers
{
    public function __construct(
        private CommandBus $bus,
        private CommandRegistry $registry,
        private CommandEntrance $entrance,
        private ActorStore $actors,
    ) {}

    public function for(CommandEntry $entry): EntryDispatcher
    {
        return new EntryDispatcher($this->bus, $this->registry, $this->entrance, $entry);
    }

    /**
     * Runs the command through its entry as the journal itself, under the named trusted entry.
     *
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    public function runAsJournal(CommandEntry $entry, string $trustedEntry, Command $command): mixed
    {
        $dispatcher = $this->for($entry);

        return $this->actors->actAsSystem($trustedEntry, fn (): mixed => $dispatcher->run($command));
    }
}
