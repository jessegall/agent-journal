<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\OpenAgentRuntime;
use App\Agents\Commands\OpenHostMainRuntime;
use App\Agents\Enums\DriverType;
use App\Agents\Support\OpenedRuntime;
use App\Contracts\CommandHandler;

final readonly class OpenHostMainRuntimeHandler implements CommandHandler
{
    public function __construct(private OpenAgentRuntimeHandler $runtimes) {}

    /**
     * The same opening as OpenAgentRuntime for a top-level runtime: the host's folders and the launch rules apply.
     */
    public function handle(OpenHostMainRuntime $command): OpenedRuntime
    {
        return $this->runtimes->handle(new OpenAgentRuntime($command->agentId, $command->hostId, $command->folder, $command->program, $command->programBuild, $command->profile, DriverType::Terminal));
    }
}
