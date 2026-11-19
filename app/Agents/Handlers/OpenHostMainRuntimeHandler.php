<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\OpenHostMainRuntime;
use App\Agents\Contracts\MainSeatTakeover;
use App\Agents\Models\Agent;
use App\Agents\Support\OpenedRuntime;
use App\Contracts\CommandHandler;

final readonly class OpenHostMainRuntimeHandler implements CommandHandler
{
    public function __construct(
        private OpenAgentRuntimeHandler $runtimes,
        private MainSeatTakeover $takeover,
    ) {}

    /**
     * The same opening as OpenAgentRuntime for a top-level runtime, then the seat at main: the host's folders and the
     * launch rules apply, and a different former main is fenced.
     */
    public function handle(OpenHostMainRuntime $command): OpenedRuntime
    {
        $opened = $this->runtimes->handle($command->asAgentRuntime());
        $this->takeover->takeOver(Agent::query()->findOrFail($command->agentId));

        return $opened;
    }
}
