<?php

declare(strict_types=1);

namespace Domain\Access\Handlers;

use Domain\Access\Commands\GrantEnvironmentAccess;
use Domain\Access\Handlers\Support\AccessCommandHandler;
use Domain\Access\Support\EnvironmentAccess;

final readonly class GrantEnvironmentAccessHandler extends AccessCommandHandler
{
    public function __construct(private EnvironmentAccess $access) {}

    public function handle(GrantEnvironmentAccess $command): void
    {
        $this->access->grant($command->userId, $command->environmentId, $command->permissions);
    }
}
