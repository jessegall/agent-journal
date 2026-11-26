<?php

declare(strict_types=1);

namespace App\Access\Commands\GrantEnvironmentAccess;

use App\Access\Commands\Support\AccessCommandHandler;
use App\Access\EnvironmentAccess;

final readonly class GrantEnvironmentAccessHandler extends AccessCommandHandler
{
    public function __construct(private EnvironmentAccess $access) {}

    public function handle(GrantEnvironmentAccessCommand $command): void
    {
        $this->access->grant($command->userId, $command->environmentId, $command->permissions);
    }
}
