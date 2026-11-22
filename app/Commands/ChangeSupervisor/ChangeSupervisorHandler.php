<?php

declare(strict_types=1);

namespace App\Commands\ChangeSupervisor;

use App\Contracts\Bus\CommandHandler;
use App\Support\ActorIdentity;
use App\Support\SupervisorRouting;
use App\Values\SupervisorChangeReceipt;

final readonly class ChangeSupervisorHandler implements CommandHandler
{
    public function __construct(private SupervisorRouting $routes) {}

    public function handle(ChangeSupervisorCommand $command): SupervisorChangeReceipt
    {
        return $this->routes->change($command, ActorIdentity::of($command->dispatchedBy()));
    }
}
