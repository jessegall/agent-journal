<?php

declare(strict_types=1);

namespace App\Commands\Desks\ProvisionActorDesk;

use App\Contracts\Actors\ActorProvisioning;
use App\Contracts\Bus\CommandHandler;

final readonly class ProvisionActorDeskHandler implements CommandHandler
{
    public function __construct(private ActorProvisioning $provisioning) {}

    public function handle(ProvisionActorDeskCommand $command): void
    {
        $this->provisioning->provision($command->actor, $command->label);
    }
}
