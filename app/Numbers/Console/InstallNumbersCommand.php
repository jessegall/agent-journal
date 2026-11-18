<?php

declare(strict_types=1);

namespace App\Numbers\Console;

use App\Bus\Contracts\CommandBus;
use App\Numbers\Commands\InstallNumbers;
use Illuminate\Console\Command;

final class InstallNumbersCommand extends Command
{
    protected $signature = 'numbers:install';

    protected $description = 'Create the global number group the journal numbers its records in';

    public function handle(CommandBus $commands): int
    {
        $commands->run(new InstallNumbers);
        $this->info('The journal number group is installed.');

        return self::SUCCESS;
    }
}
