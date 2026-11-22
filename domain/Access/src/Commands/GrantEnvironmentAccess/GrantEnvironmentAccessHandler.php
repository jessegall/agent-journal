<?php

declare(strict_types=1);

namespace Domain\Access\Commands\GrantEnvironmentAccess;

use Domain\Access\Commands\Support\AccessCommandHandler;
use Domain\Access\Support\EnvironmentAccess;

final readonly class GrantEnvironmentAccessHandler extends AccessCommandHandler
{
    public function __construct(private EnvironmentAccess $access) {}

    public function handle(GrantEnvironmentAccessCommand $command): void
    {
        $this->access->grant($command->userId, $command->environmentId, $command->permissions);
    }
}
