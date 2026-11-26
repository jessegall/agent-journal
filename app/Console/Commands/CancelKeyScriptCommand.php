<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Bus\ConsoleOwner;
use App\Bus\Contracts\CommandBus;
use App\Exceptions\ConsoleOwnerMissing;
use App\Terminals\Commands\CancelKeyScript\CancelKeyScriptCommand as CancelKeyScript;
use Illuminate\Console\Command;

/**
 * The owner cancels a key script stopped part way.
 */
final class CancelKeyScriptCommand extends Command
{
    protected $signature = 'agents:key-script-cancel {request : The driver request} {--row-version= : The row version you read} {--reason= : Why}';

    protected $description = 'Cancel a key script stopped part way';

    /**
     * @throws ConsoleOwnerMissing
     */
    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();

        try {
            $rowVersion = $commands->run(new CancelKeyScript(
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
