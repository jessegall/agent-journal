<?php

declare(strict_types=1);

namespace Domain\Access\Handlers;

use Domain\Access\Commands\DisableUser;
use Domain\Access\Handlers\Support\AccessCommandHandler;
use Domain\Access\Support\EnvironmentAccess;

final readonly class DisableUserHandler extends AccessCommandHandler
{
    public function __construct(private EnvironmentAccess $access) {}

    public function handle(DisableUser $command): void
    {
        $this->access->disable($command->userId);
    }
}
