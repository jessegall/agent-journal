<?php

declare(strict_types=1);

namespace App\Commands\OpenBindingMainRuntime;

use App\Commands\OpenAgentRuntime\OpenAgentRuntimeHandler;
use App\Contracts\BuiltInStartProfiles;
use App\Contracts\CommandHandler;
use App\Models\Agent;
use App\Support\OpenedRuntime;

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
