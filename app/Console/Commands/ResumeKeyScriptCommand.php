<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Bus\ConsoleOwner;
use App\Bus\Contracts\CommandBus;
use App\Exceptions\ConsoleOwnerMissing;
use App\Terminals\Commands\ResumeKeyScript\ResumeKeyScriptCommand as ResumeKeyScript;
use Illuminate\Console\Command;

/**
 * The owner lets a key script stopped part way go on from its recorded step.
 */
final class ResumeKeyScriptCommand extends Command
{
    protected $signature = 'agents:key-script-resume {request : The driver request} {--row-version= : The row version you read} {--reason= : Why}';

    protected $description = 'Let a stopped key script go on from its step';

    /**
     * @throws ConsoleOwnerMissing
     */
    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();

        try {
            $rowVersion = $commands->run(new ResumeKeyScript(
                (string) $this->argument('request'),
                (int) $this->option('row-version'),
                (string) $this->option('reason'),
            ));
        } finally {
            $owner->finish();
        }

        $this->line("Resumed. Its row version is now {$rowVersion}.");

        return self::SUCCESS;
    }
}
