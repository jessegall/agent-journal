<?php

declare(strict_types=1);

namespace App\Commands\Agents\EnforceSessionStartLimits;

use App\Contracts\Bus\CommandHandler;
use App\Support\EngineAccess;
use App\Support\SessionStartLimits;

/**
 * Runs the launch limits only under the engine's grant.
 */
final readonly class EnforceSessionStartLimitsHandler implements CommandHandler
{
    public function __construct(
        private EngineAccess $access,
        private SessionStartLimits $limits,
    ) {}

    public function handle(EnforceSessionStartLimitsCommand $command): void
    {
        $this->access->assertMaintenanceGranted(EnforceSessionStartLimitsCommand::MAINTENANCE_SCOPE);

        $this->limits->stopOverdue();
        $this->limits->enforceFences();
    }
}
