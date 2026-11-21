<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Contracts\AgentStartCommand;
use App\Agents\Enums\DriverVariant;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\OpenedRuntime;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * Opens a runtime for an agent on an enrolled host: a user may pick any host and permitted folder, an agent only
 * opens a child on its own session's host inside its own folder. One commit holds the session, the runtime in
 * Starting and the first delivery (doc 40, section 11).
 *
 * @extends Command<OpenedRuntime>
 */
#[Authorize(AgentPolicy::class, AccessType::Create)]
final readonly class OpenAgentRuntime extends Command implements AgentStartCommand
{
    public function __construct(
        public string $agentId,
        public string $hostId,
        public string $folder,
        public string $driver,
        public string $driverBuild,
        public string $profile,
        public DriverVariant $variant,
        public string|null $model = null,
        public string|null $effort = null,
        public string|null $firstMessage = null,
        public bool $saveVariant = false,
    ) {}

    public function startedAgentId(): string
    {
        return $this->agentId;
    }
}
