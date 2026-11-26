<?php

declare(strict_types=1);

namespace App\Inboxes\Commands\ProvisionActorInbox;

use App\Actors\Contracts\ActorProvisioning;
use App\Bus\Contracts\CommandHandler;

final readonly class ProvisionActorInboxHandler implements CommandHandler
{
    public function __construct(private ActorProvisioning $provisioning) {}

    public function handle(ProvisionActorInboxCommand $command): void
    {
        $this->provisioning->provision($command->actor, $command->label);
    }
}
