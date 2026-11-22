<?php

declare(strict_types=1);

namespace Domain\Access\Handlers;

use Domain\Access\Commands\RevokeEnvironmentAccess;
use Domain\Access\Handlers\Support\AccessCommandHandler;
use Domain\Access\Support\EnvironmentAccess;

final readonly class RevokeEnvironmentAccessHandler extends AccessCommandHandler
{
    public function __construct(private EnvironmentAccess $access) {}

    public function handle(RevokeEnvironmentAccess $command): void
    {
        $this->access->revoke($command->userId, $command->environmentId);
    }
}
