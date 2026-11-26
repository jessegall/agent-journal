<?php

declare(strict_types=1);

namespace App\Navigation\Values;

use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Navigation\Commands\RaiseNavigation\RaiseNavigationCommand;
use App\Navigation\NavigationDispatch;
use App\Support\ActorReference;

/**
 * The locked runtime and driver request with the owner and dispatcher for this raise.
 */
final readonly class NavigationAdmission
{
    public function __construct(
        public RaiseNavigationCommand $command,
        public AgentRuntime $runtime,
        public DriverRequest $request,
        public ActorReference $owner,
        public NavigationDispatch $dispatch,
    ) {}

    public function fingerprint(): string
    {
        return $this->command->uncertainty->fingerprint;
    }
}
