<?php

declare(strict_types=1);

namespace App\Commands\EnforceLaunchLimits;

use App\Contracts\Bus\CommandHandler;
use App\Support\EngineAccess;
use App\Support\LaunchLimits;

/**
 * Runs the launch limits only under the engine's grant.
 */
final readonly class EnforceLaunchLimitsHandler implements CommandHandler
{
    public function __construct(
        private EngineAccess $access,
        private LaunchLimits $limits,
    ) {}

    public function handle(EnforceLaunchLimitsCommand $command): void
    {
        $this->access->assertMaintenanceGranted(EnforceLaunchLimitsCommand::MAINTENANCE_SCOPE);

        $this->limits->stopOverdue();
        $this->limits->enforceFences();
    }
}
