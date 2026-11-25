<?php

declare(strict_types=1);

namespace App\Commands\Access\RevokeEnvironmentAccess;

use App\Commands\Access\Support\AccessCommandHandler;
use App\Support\Access\EnvironmentAccess;

final readonly class RevokeEnvironmentAccessHandler extends AccessCommandHandler
{
    public function __construct(private EnvironmentAccess $access) {}

    public function handle(RevokeEnvironmentAccessCommand $command): void
    {
        $this->access->revoke($command->userId, $command->environmentId);
    }
}
