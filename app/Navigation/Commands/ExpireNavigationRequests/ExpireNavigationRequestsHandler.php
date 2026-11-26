<?php

declare(strict_types=1);

namespace App\Navigation\Commands\ExpireNavigationRequests;

use App\Bus\Contracts\CommandHandler;
use App\Engine\EngineAccess;
use App\Navigation\Contracts\NavigationExpiry;

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
