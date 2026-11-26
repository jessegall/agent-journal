<?php

declare(strict_types=1);

namespace App\Agents\Commands\ChangeSupervisor;

use App\Agents\Values\SupervisorChangeReceipt;
use App\Asks\SupervisorDefinitions;
use App\Bus\Contracts\CommandHandler;

final readonly class ChangeSupervisorHandler implements CommandHandler
{
    public function __construct(private SupervisorDefinitions $routes) {}

    public function handle(ChangeSupervisorCommand $command): SupervisorChangeReceipt
    {
        return $this->routes->change($command, $command->dispatchedBy());
    }
}
