<?php

declare(strict_types=1);

namespace App\Engine\Commands\ExpireNavigationRequests;

use App\Agents\Contracts\NavigationExpiry;
use App\Contracts\CommandHandler;
use App\Engine\Support\EngineAccess;

/**
 * Runs the navigation expiry sweep, one bounded batch, only under the engine's agents.navigation grant.
 */
final readonly class ExpireNavigationRequestsHandler implements CommandHandler
{
    public function __construct(
        private EngineAccess $access,
        private NavigationExpiry $navigation,
    ) {}

    public function handle(ExpireNavigationRequestsCommand $command): void
    {
        $this->access->assertMaintenanceGranted(ExpireNavigationRequestsCommand::MAINTENANCE_SCOPE);

        $this->navigation->expireDue();
    }
}
