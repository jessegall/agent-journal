<?php

declare(strict_types=1);

namespace App\Agents\Commands\OpenBindingMainRuntime;

use App\Agents\Commands\OpenAgentRuntime\OpenAgentRuntimeHandler;
use App\Agents\Contracts\BuiltInStartProfiles;
use App\Agents\Models\Agent;
use App\Agents\Support\OpenedRuntime;
use App\Contracts\CommandHandler;

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
        $variant = $agent->variantFor(null, $this->builtInProfiles->defaultVariantOf($agent->profile_key));

        return $this->runtimes->handle($command->asAgentRuntime($variant)->withDispatcher($command->dispatchedBy()));
    }
}
