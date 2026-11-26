<?php

declare(strict_types=1);

namespace App\Bus;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\OwnerCommands as OwnerCommandsContract;

/**
 * Runs a console command's bus command as the configured owner, and ends the owner's turn when it is done.
 */
final readonly class OwnerCommands implements OwnerCommandsContract
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
