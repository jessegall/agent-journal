<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\CommandEntry;
use App\Bus\Exceptions\CommandNotRegistered;

/**
 * The dispatcher of one entry: it runs only that entry's commands, through the shared bus, and answers any other
 * command as the bus answers an unknown one, so an entry never shows what another entry may run.
 */
final readonly class EntryDispatcher
{
    public function __construct(
        private CommandBus $bus,
        private CommandRegistry $registry,
        private CommandEntrance $entrance,
        private CommandEntry $entry,
    ) {}

    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     *
     * @throws CommandNotRegistered
     */
    public function run(Command $command): mixed
    {
        if (! $this->registry->has($command::class) || $this->registry->entryOf($command::class) !== $this->entry) {
            throw CommandNotRegistered::for($command::class);
        }

        return $this->entrance->through($this->entry, fn (): mixed => $this->bus->run($command));
    }
}
