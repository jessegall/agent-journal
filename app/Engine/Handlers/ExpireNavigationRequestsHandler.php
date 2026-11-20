<?php

declare(strict_types=1);

namespace App\Engine\Handlers;

use App\Agents\Contracts\ExpiresNavigation;
use App\Contracts\CommandHandler;
use App\Engine\Commands\ExpireNavigationRequests;
use App\Engine\Support\EngineAccess;

/**
 * Runs the navigation expiry sweep, one bounded batch, only under the engine's agents.navigation grant.
 */
final readonly class ExpireNavigationRequestsHandler implements CommandHandler
{
    public function __construct(
        private EngineAccess $access,
        private ExpiresNavigation $navigation,
    ) {}

    public function handle(ExpireNavigationRequests $command): void
    {
        $this->access->assertMaintenanceGranted(ExpireNavigationRequests::MAINTENANCE_SCOPE);

        $this->navigation->expireDue();
    }
}
