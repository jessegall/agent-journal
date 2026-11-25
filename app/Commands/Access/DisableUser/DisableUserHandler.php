<?php

declare(strict_types=1);

namespace App\Commands\Access\DisableUser;

use App\Commands\Access\Support\AccessCommandHandler;
use App\Support\Access\EnvironmentAccess;

final readonly class DisableUserHandler extends AccessCommandHandler
{
    public function __construct(private EnvironmentAccess $access) {}

    public function handle(DisableUserCommand $command): void
    {
        $this->access->disable($command->userId);
    }
}
