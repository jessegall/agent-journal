<?php

declare(strict_types=1);

namespace App\Supervision\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Supervision\Commands\ChangeSupervisor;
use App\Supervision\Support\SupervisorRouting;
use App\Supervision\Values\SupervisorChangeReceipt;

final readonly class ChangeSupervisorHandler implements CommandHandler
{
    public function __construct(private SupervisorRouting $routes) {}

    public function handle(ChangeSupervisor $command): SupervisorChangeReceipt
    {
        return $this->routes->change($command, ActorIdentity::of($command->dispatchedBy()));
    }
}
