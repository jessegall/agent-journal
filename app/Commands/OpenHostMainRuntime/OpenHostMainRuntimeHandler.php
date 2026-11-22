<?php

declare(strict_types=1);

namespace App\Commands\OpenHostMainRuntime;

use App\Commands\OpenAgentRuntime\OpenAgentRuntimeHandler;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Chat\MainSeatTakeover;
use App\Contracts\Sessions\BuiltInStartProfiles;
use App\Models\Agent;
use App\Support\OpenedRuntime;

final readonly class OpenHostMainRuntimeHandler implements CommandHandler
{
    public function __construct(
        private OpenAgentRuntimeHandler $runtimes,
        private MainSeatTakeover $takeover,
        private BuiltInStartProfiles $builtInProfiles,
    ) {}

    /**
     * The same opening as OpenAgentRuntime for a top-level runtime, then the seat at main: the host's folders and the
     * start rules apply, and a different former main is fenced.
     */
    public function handle(OpenHostMainRuntimeCommand $command): OpenedRuntime
    {
        $agent = Agent::query()->findOrFail($command->agentId);
        $variant = $agent->variantFor(null, $this->builtInProfiles->defaultVariantOf($agent->profile_key));
        $runtime = $command->asAgentRuntime($variant)->withDispatcher($command->dispatchedBy());
        $opened = $this->runtimes->handle($runtime);
        $this->takeover->takeOver($agent);

        return $opened;
    }
}
