<?php

declare(strict_types=1);

namespace App\Commands\Inboxes\ProvisionActorInbox;

use App\Contracts\Actors\ActorProvisioning;
use App\Contracts\Bus\CommandHandler;

final readonly class ProvisionActorInboxHandler implements CommandHandler
{
    public function __construct(private ActorProvisioning $provisioning) {}

    public function handle(ProvisionActorInboxCommand $command): void
    {
        $this->provisioning->provision($command->actor, $command->label);
    }
}
