<?php

declare(strict_types=1);

namespace App\Agents\Commands\EnforceSessionStartLimits;

use App\Bus\Contracts\CommandHandler;
use App\Engine\EngineAccess;
use App\Sessions\SessionStartLimits;

/**
 * Runs the start limits only under the engine's grant.
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
