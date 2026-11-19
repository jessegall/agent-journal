<?php

declare(strict_types=1);

namespace App\Agents\Console;

use App\Actors\Exceptions\ConsoleOwnerMissing;
use App\Agents\Commands\RepairDriverSettings;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\ConsoleOwner;
use Illuminate\Console\Command;

/**
 * The owner gives a failed setting change a new value in its own place in the queue.
 */
final class RepairDriverSettingsCommand extends Command
{
    protected $signature = 'agents:settings-repair {request : The driver request}'
        .' {--row-version= : The row version you read} {--reason= : Why}'
        .' {--value= : The model or effort to ask for instead}';

    protected $description = 'Give a failed setting change a new value in place';

    /**
     * @throws ConsoleOwnerMissing
     */
    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();

        try {
            $rowVersion = $commands->run(new RepairDriverSettings(
                (string) $this->argument('request'),
                (int) $this->option('row-version'),
                (string) $this->option('value'),
                (string) $this->option('reason'),
            ));
        } finally {
            $owner->finish();
        }

        $this->line("Repaired. Its row version is now {$rowVersion}.");

        return self::SUCCESS;
    }
}
