<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Commands\Records\InstallNumbers\InstallNumbersCommand as InstallNumbers;
use App\Enums\Accounts\CommandEntry;
use App\Support\JournalCommands;
use Illuminate\Console\Command;

final class InstallNumbersCommand extends Command
{
    protected $signature = 'numbers:install';

    protected $description = 'Create the global number group the journal numbers its records in';

    public function handle(JournalCommands $dispatchers): int
    {
        $dispatchers->runAsJournal(CommandEntry::HostControl, 'number install', new InstallNumbers());
        $this->info('The journal number group is installed.');

        return self::SUCCESS;
    }
}
