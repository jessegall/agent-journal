<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Commands\RaiseNavigation\RaiseNavigationCommand;
use App\Models\AgentRuntime;
use App\Models\DriverRequest;
use App\Support\ActorIdentity;
use App\Support\NavigationDispatch;

/**
 * The locked runtime and driver request with the owner and dispatcher for this raise.
 */
final readonly class NavigationAdmission
{
    public function __construct(
        public RaiseNavigationCommand $command,
        public AgentRuntime $runtime,
        public DriverRequest $request,
        public ActorIdentity $owner,
        public NavigationDispatch $dispatch,
    ) {}

    public function fingerprint(): string
    {
        return $this->command->uncertainty->fingerprint;
    }
}
