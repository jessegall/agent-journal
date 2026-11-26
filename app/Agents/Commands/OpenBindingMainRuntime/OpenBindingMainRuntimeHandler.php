<?php

declare(strict_types=1);

namespace App\Agents\Commands\OpenBindingMainRuntime;

use App\Agents\Commands\OpenAgentRuntime\OpenAgentRuntimeHandler;
use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\Agent;
use App\Sessions\Contracts\BuiltInStartProfiles;
use App\Sessions\OpenedRuntime;

final readonly class OpenBindingMainRuntimeHandler implements CommandHandler
{
    public function __construct(
        private OpenAgentRuntimeHandler $runtimes,
        private BuiltInStartProfiles $builtInProfiles,
    ) {}

    /**
     * The same opening as OpenAgentRuntime for a top-level runtime, without the seat at this journal's main desk: a
     * connected project's main agent belongs to its own project and environment, so its start never fences the main
     * agent seated here.
     */
    public function handle(OpenBindingMainRuntimeCommand $command): OpenedRuntime
    {
        $agent = Agent::query()->findOrFail($command->agentId);
        $driverType = $agent->driverTypeFor(null, $this->builtInProfiles->defaultDriverTypeOf($agent->profile_key));

        return $this->runtimes->handle($command->asAgentRuntime($driverType)->withDispatcher($command->dispatchedBy()));
    }
}
