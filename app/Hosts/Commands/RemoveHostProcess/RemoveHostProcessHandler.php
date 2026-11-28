<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveHostProcess;

use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandHandler;
use App\Hosts\Commands\RemoveHostContainer\RemoveHostContainerCommand;
use App\Models\Hosts\HostProcess;

final readonly class RemoveHostProcessHandler implements CommandHandler
{
    public function __construct(private CommandBus $commands) {}

    public function handle(RemoveHostProcessCommand $command): string
    {
        $process = HostProcess::findLocked($command->processId);

        return $this->commands->run(new RemoveHostContainerCommand($process->host_id, $process->container_name));
    }
}
