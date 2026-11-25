<?php

declare(strict_types=1);

namespace App\Commands\Agents\ChangeSupervisor;

use App\Contracts\Bus\CommandHandler;
use App\Support\SupervisorDefinitions;
use App\Values\SupervisorChangeReceipt;

final readonly class ChangeSupervisorHandler implements CommandHandler
{
    public function __construct(private SupervisorDefinitions $routes) {}

    public function handle(ChangeSupervisorCommand $command): SupervisorChangeReceipt
    {
        return $this->routes->change($command, $command->dispatchedBy());
    }
}
