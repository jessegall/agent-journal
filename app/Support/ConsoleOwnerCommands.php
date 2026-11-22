<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Command;
use App\Contracts\CommandBus;
use App\Contracts\OwnerCommands;

/**
 * Runs a console command's bus command as the configured owner, and ends the owner's turn when it is done.
 */
final readonly class ConsoleOwnerCommands implements OwnerCommands
{
    public function __construct(
        private ConsoleOwner $owner,
        private CommandBus $commands,
    ) {}

    public function run(Command $command): mixed
    {
        $this->owner->actAsOwner();

        try {
            return $this->commands->run($command);
        } finally {
            $this->owner->finish();
        }
    }
}
