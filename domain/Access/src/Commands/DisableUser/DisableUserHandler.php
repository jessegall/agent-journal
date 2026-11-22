<?php

declare(strict_types=1);

namespace Domain\Access\Commands\DisableUser;

use Domain\Access\Commands\Support\AccessCommandHandler;
use Domain\Access\Support\EnvironmentAccess;

final readonly class DisableUserHandler extends AccessCommandHandler
{
    public function __construct(private EnvironmentAccess $access) {}

    public function handle(DisableUserCommand $command): void
    {
        $this->access->disable($command->userId);
    }
}
