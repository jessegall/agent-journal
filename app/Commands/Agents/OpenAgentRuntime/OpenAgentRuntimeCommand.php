<?php

declare(strict_types=1);

namespace App\Commands\Agents\OpenAgentRuntime;

use App\Attributes\Commands\Authorize;
use App\Contracts\Bus\AgentStartCommand;
use App\Enums\Agents\AccessType;
use App\Enums\Drivers\DriverType;
use App\Policies\AgentPolicy;
use App\Support\Command;
use App\Support\OpenedRuntime;

/**
 * Opens a runtime for an agent on an enrolled host: a user may pick any host and permitted folder, an agent only
 * opens a child on its own session's host inside its own folder. One commit holds the session, the runtime in
 * Starting and the first delivery.
 *
 * @extends Command<OpenedRuntime>
 */
#[Authorize(AgentPolicy::class, AccessType::Create)]
final readonly class OpenAgentRuntimeCommand extends Command implements AgentStartCommand
{
    public function __construct(
        public string $agentId,
        public string $hostId,
        public string $folder,
        public string $driver,
        public string $driverBuild,
        public string $profile,
        public DriverType $driverType,
        public string|null $model = null,
        public string|null $effort = null,
        public string|null $firstMessage = null,
        public bool $shouldSaveDriverType = false,
    ) {}

    public function startedAgentId(): string
    {
        return $this->agentId;
    }
}
