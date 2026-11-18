<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ClaimLaunchGrant;
use App\Agents\Support\HostRuntimes;
use App\Contracts\CommandHandler;

final readonly class ClaimLaunchGrantHandler implements CommandHandler
{
    public function __construct(private HostRuntimes $runtimes) {}

    public function handle(ClaimLaunchGrant $command): string|null
    {
        return $this->runtimes->claimLaunchGrant($command->hostId, $command->runtimeId);
    }
}
