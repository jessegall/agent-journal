<?php

declare(strict_types=1);

namespace App\Agents\Console;

use App\Actors\Exceptions\ConsoleOwnerMissing;
use App\Agents\Commands\CancelDriverRequest;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\ConsoleOwner;
use Illuminate\Console\Command;

/**
 * The owner cancels a driver request that has not started.
 */
final class CancelDriverRequestCommand extends Command
{
    protected $signature = 'agents:request-cancel {request : The driver request} {--row-version= : The row version you read} {--reason= : Why}';

    protected $description = 'Cancel a driver request that has not started';

    /**
     * @throws ConsoleOwnerMissing
     */
    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();

        try {
            $rowVersion = $commands->run(new CancelDriverRequest(
                (string) $this->argument('request'),
                (int) $this->option('row-version'),
                (string) $this->option('reason'),
            ));
        } finally {
            $owner->finish();
        }

        $this->line("Cancelled. Its row version is now {$rowVersion}.");

        return self::SUCCESS;
    }
}
