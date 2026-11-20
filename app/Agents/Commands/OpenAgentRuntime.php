<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Agents\Contracts\StartsAgent;
use App\Agents\Enums\AgentAbility;
use App\Agents\Enums\DriverType;
use App\Agents\Handlers\OpenAgentRuntimeHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\OpenedRuntime;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;

/**
 * Opens a runtime for an agent on an enrolled host: a user may pick any host and permitted folder, an agent only
 * opens a child on its own session's host inside its own folder. One commit holds the session, the runtime in
 * Starting and the first delivery (doc 40, section 11).
 *
 * @extends Command<OpenedRuntime>
 */
#[HandledBy(OpenAgentRuntimeHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Work)]
#[Operation('open_agent_runtime', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class OpenAgentRuntime extends Command implements HasAuthorizationSubject, StartsAgent
{
    public function __construct(
        public string $agentId,
        public string $hostId,
        public string $folder,
        public string $program,
        public string $programBuild,
        public string $profile,
        public DriverType $driverType,
        public string|null $model = null,
        public string|null $effort = null,
        public string|null $firstMessage = null,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }

    public function startedAgentId(): string
    {
        return $this->agentId;
    }
}
