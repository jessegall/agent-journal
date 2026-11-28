<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Accounts\Enums\CommandEntry;
use App\Bus\JournalCommands;
use App\Projects\Commands\RevokeHost\RevokeHostCommand as RevokeHost;
use Illuminate\Console\Command;

/**
 * Revokes every host enrolled under an installation name, run by whoever operates the machines, such as for a test
 * machine that is gone.
 */
final class RevokeHostCommand extends Command
{
    protected $signature = 'agents:host-revoke {name : The installation name of the hosts to revoke}';

    protected $description = 'Revoke every host enrolled under an installation name';

    public function handle(JournalCommands $dispatchers): int
    {
        $revoked = $dispatchers->runAsJournal(CommandEntry::HostControl, 'host revocation', new RevokeHost($this->installationName()));
        $this->line("{$revoked} hosts named {$this->installationName()} are revoked.");

        return self::SUCCESS;
    }

    /**
     * The name argument, which the signature makes a required single value.
     */
    private function installationName(): string
    {
        return $this->argument('name');
    }
}
