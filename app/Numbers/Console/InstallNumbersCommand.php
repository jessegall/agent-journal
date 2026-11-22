<?php

declare(strict_types=1);

namespace App\Numbers\Console;

use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Numbers\Commands\InstallNumbers\InstallNumbersCommand as InstallNumbers;
use Illuminate\Console\Command;

final class InstallNumbersCommand extends Command
{
    protected $signature = 'numbers:install';

    protected $description = 'Create the global number group the journal numbers its records in';

    public function handle(EntryDispatchers $dispatchers): int
    {
        $dispatchers->runAsJournal(CommandEntry::HostControl, 'number install', new InstallNumbers());
        $this->info('The journal number group is installed.');

        return self::SUCCESS;
    }
}
