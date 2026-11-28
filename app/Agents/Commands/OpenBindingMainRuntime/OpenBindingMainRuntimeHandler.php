<?php

declare(strict_types=1);

namespace App\Agents\Commands\OpenBindingMainRuntime;

use App\Agents\Commands\OpenAgentRuntime\OpenAgentRuntimeHandler;
use App\Agents\Drivers\Enums\DriverType;
use App\Bus\Contracts\CommandHandler;
use App\Sessions\OpenedRuntime;

final readonly class OpenBindingMainRuntimeHandler implements CommandHandler
{
    public function __construct(
        private OpenAgentRuntimeHandler $runtimes,
    ) {}

    /**
     * The same opening as OpenAgentRuntime for a top-level runtime, without the seat at this journal's main desk: a
     * connected project's main agent belongs to its own project and environment, so its start never fences the main
     * agent seated here.
     */
    public function handle(OpenBindingMainRuntimeCommand $command): OpenedRuntime
    {
        $runtime = $command->asAgentRuntime(DriverType::ofOwnTerminal());

        return $this->runtimes->handle($runtime->withDispatcher($command->dispatchedBy()));
    }
}
