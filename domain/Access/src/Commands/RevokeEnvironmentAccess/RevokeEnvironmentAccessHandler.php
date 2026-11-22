<?php

declare(strict_types=1);

namespace Domain\Access\Commands\RevokeEnvironmentAccess;

use Domain\Access\Commands\Support\AccessCommandHandler;
use Domain\Access\Support\EnvironmentAccess;

final readonly class RevokeEnvironmentAccessHandler extends AccessCommandHandler
{
    public function __construct(private EnvironmentAccess $access) {}

    public function handle(RevokeEnvironmentAccessCommand $command): void
    {
        $this->access->revoke($command->userId, $command->environmentId);
    }
}
