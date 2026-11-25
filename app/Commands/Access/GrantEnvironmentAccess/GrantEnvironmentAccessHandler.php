<?php

declare(strict_types=1);

namespace App\Commands\Access\GrantEnvironmentAccess;

use App\Commands\Access\Support\AccessCommandHandler;
use App\Support\Access\EnvironmentAccess;

final readonly class GrantEnvironmentAccessHandler extends AccessCommandHandler
{
    public function __construct(private EnvironmentAccess $access) {}

    public function handle(GrantEnvironmentAccessCommand $command): void
    {
        $this->access->grant($command->userId, $command->environmentId, $command->permissions);
    }
}
