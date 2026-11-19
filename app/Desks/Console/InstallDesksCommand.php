<?php

declare(strict_types=1);

namespace App\Desks\Console;

use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Desks\Commands\InstallDesks;
use Illuminate\Console\Command;

final class InstallDesksCommand extends Command
{
    protected $signature = 'desks:install';

    protected $description = 'Create the main desk and the source desks of the system and the engine';

    public function handle(EntryDispatchers $dispatchers): int
    {
        $dispatchers->runAsJournal(CommandEntry::HostControl, 'desk install', new InstallDesks());
        $this->info('The built-in desks are installed.');

        return self::SUCCESS;
    }
}
