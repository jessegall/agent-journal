<?php

declare(strict_types=1);

namespace App\Access\Commands\DisableUser;

use App\Access\Commands\Support\AccessCommandHandler;
use App\Access\EnvironmentAccess;

final readonly class DisableUserHandler extends AccessCommandHandler
{
    public function __construct(private EnvironmentAccess $access) {}

    public function handle(DisableUserCommand $command): void
    {
        $this->access->disable($command->userId);
    }
}
