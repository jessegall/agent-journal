<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Agents\Drivers\Commands\ApproveDriver\ApproveDriverCommand;
use App\Bus\ConsoleOwner;
use App\Bus\Contracts\CommandBus;
use App\Values\DriverKey;
use Illuminate\Console\Command;

final class DriverApproveCommand extends Command
{
    protected $signature = 'driver:approve {key : The third-party driver key, such as acme/reader}'
        .' {--build=* : A build of the driver a host may run; repeat it for each}';

    protected $description = 'Approve a third-party driver and the builds of it a host may run';

    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();
        $key = DriverKey::from((string) $this->argument('key'));
        $builds = array_values(array_map(strval(...), (array) $this->option('build')));
        $commands->run(new ApproveDriverCommand($key, $builds));

        $this->line("Approved {$key} with ".count($builds).' builds.');

        return self::SUCCESS;
    }
}
