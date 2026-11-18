<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Commands\OpenAgentRuntime;
use App\Agents\Exceptions\HostUnavailable;
use App\Agents\Exceptions\LaunchRootRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\Host;
use App\Agents\Support\AgentContext;
use App\Agents\Support\ModelSelection;
use App\Agents\Support\OpenedRuntime;
use App\Agents\Support\RuntimeIntent;
use App\Agents\Support\SelectedProgram;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Container\Container;
use Illuminate\Support\Str;

final readonly class OpenAgentRuntimeHandler implements CommandHandler
{
    public function __construct(
        private LaunchSessions $launches,
        private CurrentActor $actors,
        private Container $container,
    ) {}

    public function handle(OpenAgentRuntime $command): OpenedRuntime
    {
        $host = Host::query()->find($command->hostId);
        if ($host === null || $host->isRevoked()) {
            throw HostUnavailable::forHost($command->hostId);
        }

        if (! $host->permitsFolder($command->folder)) {
            throw LaunchRootRefused::outsideRoots($command->folder);
        }

        $parent = $this->parentSessionFor($command);
        $intent = new RuntimeIntent($host->id, $command->folder, $command->program, $command->programBuild, $command->profile, $command->driverType, $command->model, $command->effort, $command->firstMessage);

        $selection = SelectedProgram::resolve($command->program, ModelSelection::fromInput($command->model), null, null);

        return $this->launches->launch(Agent::query()->findOrFail($command->agentId), $selection, (string) Str::ulid(), $parent, $intent)->opened();
    }

    /**
     * An agent opens only a child of its own session, on that session's host and inside its folder; a user opens a
     * top-level runtime anywhere its host permits.
     *
     * @throws LaunchRootRefused
     */
    private function parentSessionFor(OpenAgentRuntime $command): AgentSession|null
    {
        if ($this->actors->actor()->actorType() !== ActorType::Agent) {
            return null;
        }

        $parent = AgentSession::query()->findOrFail($this->container->make(AgentContext::class)->sessionId);
        $parentRuntime = AgentRuntime::query()->where('agent_session_id', $parent->id)->first();

        if ($parentRuntime === null || $parentRuntime->host_id !== $command->hostId || ! str_starts_with($command->folder, rtrim($parentRuntime->canonical_folder, '/'))) {
            throw LaunchRootRefused::foreignToAgent();
        }

        return $parent;
    }
}
