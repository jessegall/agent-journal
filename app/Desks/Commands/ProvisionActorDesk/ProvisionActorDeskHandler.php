<?php

declare(strict_types=1);

namespace App\Desks\Commands\ProvisionActorDesk;

use App\Actors\Contracts\ActorProvisioning;
use App\Contracts\CommandHandler;

final readonly class ProvisionActorDeskHandler implements CommandHandler
{
    public function __construct(private ActorProvisioning $provisioning) {}

    public function handle(ProvisionActorDeskCommand $command): void
    {
        $this->provisioning->provision($command->actor, $command->label);
    }
}
