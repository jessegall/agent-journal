<?php

declare(strict_types=1);

namespace App\Engine\Handlers;

use App\Agents\Actions\LaunchLimits;
use App\Contracts\CommandHandler;
use App\Engine\Commands\EnforceLaunchLimits;
use App\Engine\Support\EngineAccess;

/**
 * Runs the launch limits only under the engine's grant.
 */
final readonly class EnforceLaunchLimitsHandler implements CommandHandler
{
    public function __construct(
        private EngineAccess $access,
        private LaunchLimits $limits,
    ) {}

    public function handle(EnforceLaunchLimits $command): void
    {
        $this->access->assertMaintenanceGranted(EnforceLaunchLimits::MAINTENANCE_SCOPE);

        $this->limits->stopOverdue();
        $this->limits->enforceFences();
    }
}
