<?php

declare(strict_types=1);

namespace App\Access\Commands\RevokeEnvironmentAccess;

use App\Access\Commands\Support\AccessCommandHandler;
use App\Access\EnvironmentAccess;

final readonly class RevokeEnvironmentAccessHandler extends AccessCommandHandler
{
    public function __construct(private EnvironmentAccess $access) {}

    public function handle(RevokeEnvironmentAccessCommand $command): void
    {
        $this->access->revoke($command->userId, $command->environmentId);
    }
}
